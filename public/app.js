/* global CheckoutWebComponents */
(async () => {
  // Insert your public key here
  const PUBLIC_KEY = "pk_sbox_kms5vhdb66lgxsgzlgv4dgy3ziy"//"pk_sbox_dbb4uluofkxtlekoxohnmmkdneq";

  const urlParams = new URLSearchParams(window.location.search);
  let paramCountry = urlParams.get("country");
  if (!paramCountry){
    paramCountry = 'HK'
    document.getElementById("HK").checked = true
  } else {
    document.getElementById(paramCountry).checked = true
  }

  const response = await fetch("/create-payment-sessions?country=" + paramCountry, { method: "POST" }); // Order
  const paymentSession = await response.json();
  if (!response.ok) {
    console.error("Error creating payment session", paymentSession);
    return;
  }


  const translations = {
    'en-US': {
      'pay_button.redirect_cta': 'After clicking on Pay, you will be redirected to finalize your payment',
    },
  };


  const checkout = await CheckoutWebComponents({
    publicKey: PUBLIC_KEY,
    environment: "sandbox",
    // locale: "en-US",
    paymentSession,
    
    translations,

    enabled_payment_methods:[
          "alipay_cn", "alipay_hk", "applepay", "bancontact", "benefit", "card", "dana", "eps", "gcash", "googlepay", "ideal", "kakaopay", "klarna", "knet", "multibanco", "p24", "paypal", "qpay", "sepa", "sofort", "stcpay", "tng", "truemoney"
          ],
    componentOptions: {
      card: {
        data: {
          cardholderName: 'Albert Ma'
        },
        displayCardholderName: 'top'
      }
    },
    onReady: () => {
      console.log("onReady");
    },
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log("Create Payment with PaymentId: ", paymentResponse.id);
      console.log(paymentResponse)
      // window.location = "http://localhost:3000/?status=succeeded"
      alert('payment completed')
    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${component.isValid()}" for "${
          component.type
        }"`,
      );
    },
    onError: (component, error) => {
      console.log("onError", error, "Component", component.type);
    },
  });

  const flowComponent = checkout.create("flow");

  flowComponent.mount(document.getElementById("flow-container"));
})();



function triggerToast(id) {
  console.log('trigger tost')
  var element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");
}

if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}



function setAddress(country){
    console.log(this.value)
    window.location = "http://localhost:3000/?country="+this.id
    
  }
  document.getElementById('NL').addEventListener("click", setAddress);
  document.getElementById('HK').addEventListener("click", setAddress);

