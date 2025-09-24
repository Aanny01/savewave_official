// docs/js/stripe-payment.js
document.addEventListener("DOMContentLoaded", function () {
  // ---- helpers ----
  function showMessage(text, type = "info", timeout = 3000) {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.position = "fixed";
    div.style.right = "20px";
    div.style.top = type === "error" ? "20px" : "80px";
    div.style.background = type === "error" ? "#e74c3c" : "#2ecc71";
    div.style.color = "white";
    div.style.padding = "10px 14px";
    div.style.borderRadius = "8px";
    div.style.zIndex = 9999;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), timeout);
  }

  // ---- DOM elements ----
  const planOptions = document.querySelectorAll(".plan-option");
  const selectedPlanName = document.getElementById("selected-plan-name");
  const subtotal = document.getElementById("subtotal");
  const tax = document.getElementById("tax");
  const total = document.getElementById("total");
  const submitBtn = document.getElementById("submit-payment");
  const paymentForm = document.getElementById("paymentForm");

  if (!paymentForm) {
    console.error("No se encontró #paymentForm en el DOM");
    return;
  }

  // ---- plan selector ----
  planOptions.forEach((option) => {
    option.addEventListener("click", function () {
      planOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      const radio = this.querySelector(".radio-input");
      if (radio) radio.checked = true;
      updateOrderSummary();
    });
  });

  function updateOrderSummary() {
    const selectedOption = document.querySelector(".plan-option.selected");
    if (!selectedOption) return;
    const planName = selectedOption.querySelector(".plan-name").textContent;
    const planPrice = parseFloat(selectedOption.dataset.price);

    selectedPlanName.textContent = planName;

    if (planPrice === 0) {
      subtotal.textContent = "FREE";
      tax.textContent = "$0.00";
      total.textContent = "FREE";
      submitBtn.innerHTML =
        '<i class="fa-solid fa-download" style="margin-right: 10px;"></i>Start Free Plan';
    } else {
      const taxAmount = planPrice * 0.08;
      const totalAmount = planPrice + taxAmount;
      subtotal.textContent = "$" + planPrice.toFixed(2);
      tax.textContent = "$" + taxAmount.toFixed(2);
      total.textContent = "$" + totalAmount.toFixed(2);
      submitBtn.innerHTML =
        '<i class="fa-solid fa-lock" style="margin-right: 10px;"></i>Complete Payment';
    }
  }

  updateOrderSummary();

  // ---- stripe ----
  const stripe = Stripe("pk_test_51S571nKZmy3J8w3akdN9exkgHCnBP3JxFICoA0cKP60qLwIpRMhIfh0MfgVyY5PfwNspZGr2qQHV9nmSIEBUYKCa00tnOpueyJ"); // <- pon tu pk_test_

  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const selectedRadio = document.querySelector('input[name="plan"]:checked');
    if (!selectedRadio) {
      showMessage("Selecciona un plan antes de pagar", "error", 3000);
      return;
    }
    const selectedPlan = selectedRadio.value;
    console.log("Plan seleccionado:", selectedPlan);

    // Si es gratuito, no llamar al backend de Stripe
    if (selectedPlan === "basic") {
      // Aquí puedes (opcional) crear un registro local o en tu backend
      window.location.href = "/success.html"; // o ruta completa
      return;
    }

    try {
      showMessage("Creando sesión de pago...", "info", 2000);

      const response = await fetch("http://localhost:4242/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      console.log("Respuesta /create-checkout-session status:", response.status);
      const session = await response.json();
      console.log("Session response:", session);

      if (session.free) {
        window.location.href = "/success.html";
        return;
      }

      if (session.error) {
        console.error("Backend error:", session.error);
        showMessage("Error: " + session.error, "error", 4000);
        window.location.href = "/cancel.html";
        return;
      }

      if (session.id) {
        // Aviso a usuario con tarjetas de prueba
        showMessage("Redirigiendo a Stripe Checkout (modo prueba)", "info", 2000);
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) {
          console.error("redirectToCheckout error:", error);
          showMessage("Error en Checkout", "error", 4000);
          window.location.href = "/cancel.html";
        }
      } else {
        console.error("Respuesta inesperada del backend:", session);
        showMessage("Respuesta inesperada del servidor", "error", 4000);
        window.location.href = "/cancel.html";
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Error de red al crear sesión", "error", 4000);
      window.location.href = "/cancel.html";
    }
  });
});
