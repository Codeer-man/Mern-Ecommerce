import axios from "axios";
import crypto from "crypto";
import { Types } from "mongoose";

interface IHash {
  amount: number;
  transaction_uuid: Types.ObjectId;
}

export async function getEsewaPaymentHash({ amount, transaction_uuid }: IHash) {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature: hash,
      signature_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
}

export const createSignature = (message: string) => {
  const secret = "8gBm/:&EnhH.1/q"; //different in production
  // Create an HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

export interface EsewaDecodedData {
  transaction_code: string;
  status: string;
  total_amount: number;
  transaction_uuid: string;
  signed_field_names: string;
  signature: string;
}

export async function verifyEsewaPayment(encodedData: any) {
  try {
    console.log("RAW encodedData:", encodedData);

    let decodedString = btoa(encodedData);
    // let decodedString = Buffer.from(encodedData, "base64").toString("utf-8");

    console.log(decodedString, "decoded String");

    let decodedData: EsewaDecodedData = await JSON.parse(decodedString);
    console.log(decodedData, "decoded data");

    let headersList: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;
    console.log(data, "transaction");

    const secretKey = process.env.ESEWA_SECRET_KEY!;

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");
    console.log(hash, "verify");
    console.log(decodedData.signature);

    let reqOptions = {
      url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: headersList,
    };

    if (hash !== decodedData.signature) {
      throw { message: "Invalider info signature", decodedData };
    }

    let response = await axios.request(reqOptions);

    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Invalid Info", decodedData };
    }
    return { response: response.data, decodedData };
  } catch (error) {
    console.error("Esewa verification failed:", error);
    throw error;
  }
}
