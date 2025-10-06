import React from 'react';
import './PaymentPage.css'; // Ensure this CSS file exists in the same directory

const PaymentPage = () => {
  const handleAddNewCard = () => {
    alert("Add new card functionality goes here!");
  };

  return (
    <div className="payment-container">
      <header>
        <h1 className="logo">GLAMORA</h1>
        <div className="progress-bar">
          <span className="step active">Book Appointment</span>
          <span className="step active">Payment</span>
          <span className="step">Finished</span>
        </div>
      </header>

      <div className="payment-content">
        <div className="services">
          <h3>Services</h3>
          <div className="service-item">
            <strong>Wash and Style:</strong> <span>R250</span>
          </div>
          <div className="service-item">
            <strong>Acrylic Nails:</strong> <span>R300</span>
          </div>
          <div className="payment-options">
            <label>
              <input type="checkbox" /> Pay 50% Deposit
            </label>
            <label>
              <input type="checkbox" checked readOnly /> Pay Full Amount
            </label>
          </div>
          <div className="total">
            Total Pay: <strong>R550</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h3>
            Payment Methods 
            <button className="link-button" onClick={handleAddNewCard}>
              Add New Card
            </button>
          </h3>
          <div className="card visa selected">VISA ****808</div>
          <div className="card mastercard">Mastercard ****223</div>
          {/* Apple Pay option removed */}
          <button className="confirm-btn">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;