import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id:
    "AUYdm8pH5YBzWgxaEwZxQUmlLnw63q5ZomTDhkOnXIeTSwusEdWmy0elkldEQruMZk9vLYwBIUL83QxK",
  client_secret:
    "ECOqKfiQPitC-ePFx99ik935UDZk5HwDa7511d-Kx5hXtOyfstYn4RsQBXNV6g0QasBaiudUDPB80_lX",
});

export default paypal;
