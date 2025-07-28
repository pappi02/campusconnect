import React, { useState, useEffect, useContext } from "react";
import  AuthContext  from "../../contexts/AuthContext";
import mpesaLogo from "../../assets/mpesa.webp";
import googleLogo from "../../assets/googleplay.svg";

const PaymentMethod = () => {
  const { token } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addNewMethod, setAddNewMethod] = useState(""); // "card" or "mpesa"

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const [mpesaNumber, setMpesaNumber] = useState("");

  useEffect(() => {
    if (!token) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8000/api/payment-methods/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPaymentMethods(data);
        } else if (Array.isArray(data.payment_methods)) {
          setPaymentMethods(data.payment_methods);
        } else {
          console.error("Unexpected API response format:", data);
          setPaymentMethods([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch payment methods:", error);
        setPaymentMethods([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleLinkAccount = (id) => {
    alert(`Link account for payment method id ${id}`);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/payment-methods/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        } else {
          alert('Failed to delete payment method');
        }
      })
      .catch(() => {
        alert('Failed to delete payment method');
      });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const cardData = {
      card_number: cardNumber,
      card_holder_name: cardHolderName,
      expiry_date: expiryDate,
      billing_address: null,
      mpesa_number: null,
    };
    fetch('http://localhost:8000/api/payment-methods/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setPaymentMethods((prev) => [...prev, data]);
          setAddNewMethod("");
          setCardHolderName("");
          setCardNumber("");
          setExpiryDate("");
          setCvv("");
          setSaveCard(false);
          alert("New card added");
        } else {
          alert('Failed to add card');
        }
      })
      .catch(() => {
        alert('Failed to add card');
      });
  };

  const handleAddMpesa = (e) => {
    e.preventDefault();
    const mpesaData = {
      card_number: null,
      card_holder_name: null,
      expiry_date: null,
      billing_address: null,
      mpesa_number: mpesaNumber,
    };
    fetch('http://localhost:8000/api/payment-methods/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mpesaData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setPaymentMethods((prev) => [...prev, data]);
          setAddNewMethod("");
          setMpesaNumber("");
          alert(`New Mpesa number added: ${mpesaNumber}`);
        } else {
          alert('Failed to add Mpesa number');
        }
      })
      .catch(() => {
        alert('Failed to add Mpesa number');
      });
  };

  return (
    <div className="flex gap-6">
      <main className="flex-1 space-y-4 bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p className="text-gray-500">Loading payment methods...</p>
        ) : paymentMethods.length === 0 ? (
          <p className="text-gray-500">No payment methods found.</p>
        ) : (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-4">
                {method.type === "Paypal" && (
                  <img
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                    alt="Paypal"
                    className="h-6"
                  />
                )}
                {method.type === "Visa" && (
                  <>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                      alt="Visa"
                      className="h-6"
                    />
                    <span className="text-gray-700 font-semibold ml-2">
                      {method.card_number}
                    </span>
                  </>
                )}
                {method.type === "Mpesa No." && (
                  <>
                    <img src={mpesaLogo} alt="Mpesa" className="h-14 mr-2" />
                    <span className="text-gray-700 font-semibold">
                      {method.type}
                    </span>
                  </>
                )}
                {method.type !== "Visa" && method.type !== "Mpesa No." && (
                  <span className="text-gray-700 font-semibold">{method.type}</span>
                )}
              </div>
              <div>
                {method.linked ? (
                  method.type === "Visa" ? (
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLinkAccount(method.id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Link Account
                    </button>
                  )
                ) : null}
              </div>
            </div>
          ))
        )}

        {/* Add New Payment Method Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="inline-flex items-center mb-4 cursor-pointer">
            <input
              type="radio"
              name="addMethod"
              checked={addNewMethod === "card"}
              onChange={() => setAddNewMethod("card")}
              className="form-radio"
            />
            <span className="ml-2 font-semibold text-gray-700">
              Add New Credit/Debit Card
            </span>
          </label>
          <label className="inline-flex items-center mb-4 cursor-pointer">
            <input
              type="radio"
              name="addMethod"
              checked={addNewMethod === "mpesa"}
              onChange={() => setAddNewMethod("mpesa")}
              className="form-radio"
            />
            <span className="ml-2 font-semibold text-gray-700">
              Add New Mpesa Number
            </span>
          </label>

          {addNewMethod === "card" && (
            <form onSubmit={handleAddCard} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Card Holder Name *
                </label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="Ex. John Doe"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4716 9627 1635 8047"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="02/30"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">CVV *</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="000"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={() => setSaveCard(!saveCard)}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-700">Save card for future payments</span>
              </label>
              <button
                type="submit"
                className="bg-green-900 text-white rounded-full px-6 py-2 mt-4 hover:bg-green-800 transition"
              >
                Add Card
              </button>
            </form>
          )}

          {addNewMethod === "mpesa" && (
            <form onSubmit={handleAddMpesa} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mpesa Number *
                </label>
                <input
                  type="text"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-green-900 text-white rounded-full px-6 py-2 mt-4 hover:bg-green-800 transition"
              >
                Add Mpesa Number
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentMethod;
