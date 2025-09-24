document.addEventListener('DOMContentLoaded', function() 
{ 
    // Plan selection functionality 
    const planOptions = document.querySelectorAll('.plan-option');
     const selectedPlanName = document.getElementById('selected-plan-name');
      const subtotal = document.getElementById('subtotal'); 
      const tax = document.getElementById('tax'); 
      const total = document.getElementById('total'); 
      const submitBtn = document.getElementById('submit-payment');
       planOptions.forEach(option => { option.addEventListener('click', function() { 
        // Remove selected class from all options
         planOptions.forEach(opt => opt.classList.remove('selected'));
          // Add selected class to clicked option 
          this.classList.add('selected'); 
          // Update radio button 
          const radioInput = this.querySelector('.radio-input'); 
          radioInput.checked = true; 
          // Update order summary 
          updateOrderSummary(); 
        }); 
    }); 
          function updateOrderSummary() { 
            const selectedOption = document.querySelector('.plan-option.selected');
             const planName = selectedOption.querySelector('.plan-name').textContent; 
             const planPrice = parseFloat(selectedOption.dataset.price);
              selectedPlanName.textContent = planName; 
              if (planPrice === 0) { subtotal.textContent = 'FREE'; 
                tax.textContent = '$0.00'; total.textContent = 'FREE';
                 submitBtn.innerHTML = '<i class="fa-solid fa-download" style="margin-right: 10px;"></i>Start Free Plan';
                 } else { const taxAmount = planPrice * 0.08; 
                    const totalAmount = planPrice + taxAmount;
                    subtotal.textContent = '$' + planPrice.toFixed(2); t
                    ax.textContent = '$' + taxAmount.toFixed(2); 
                    total.textContent = '$' + totalAmount.toFixed(2); 
                    submitBtn.innerHTML = '<i class="fa-solid fa-lock" style="margin-right: 10px;"></i>Complete Payment'; 
                } } 
                // Payment method selection 
                const paymentMethods = document.querySelectorAll('.payment-method'); 
                const paymentForms = document.querySelectorAll('.payment-form-section'); 
                paymentMethods.forEach(method => { method.addEventListener('click', function() {
                     // Remove active class from all methods
                      paymentMethods.forEach(m => m.classList.remove('active')); 
                      // Add active class to selected method 
                      this.classList.add('active');
                       // Hide all payment forms 
                       paymentForms.forEach(form => form.style.display = 'none');
                        // Show selected payment form
                         const selectedMethod = this.dataset.method; 
                         document.getElementById(selectedMethod + '-form').style.display = 'block'; }); 
                        });
                         // Card number formatting 
                         const cardNumberInput = document.getElementById('card-number'); 
                         if (cardNumberInput) { cardNumberInput.addEventListener('input', function(e) { let value = e.target.value.replace(/\D/g, '');
                             value = value.replace(/(\d{4})(?=\d)/g, '$1 '); 
                             e.target.value = value; });
                             } 
                             // Expiry date formatting 
                             const expiryInput = document.getElementById('expiry');
                              if (expiryInput) { expiryInput.addEventListener('input', function(e) 
                                { let value = e.target.value.replace(/\D/g, ''); 
                                    if (value.length >= 2) { value = value.substring(0, 2) + '/' + value.substring(2, 4); } e.target.value = value;
                                 }); 
                                } 
                                 // CVV formatting 
                                 const cvvInput = document.getElementById('cvv');
                                  if (cvvInput) { 
                                    cvvInput.addEventListener('input', function(e) 
                                    { let value = e.target.value.replace(/\D/g, ''); 
                                        // Solo números
                                         e.target.value = value.substring(0, 4); 
                                         // Limita a 4 dígitos (CVV) 
                                    }); 
                                    } 
                                }); 