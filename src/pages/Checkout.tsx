import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "Cairo", // Default city
    postalCode: "",
    phone: ""
  });

  const [shippingCost, setShippingCost] = useState(65);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.products?.sale_price || item.products?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    const gov = form.governorate.toLowerCase();
    setShippingCost(gov === "cairo" || gov === "giza" ? 65 : 100);
  }, [form.governorate]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return (
      emailRegex.test(form.email) &&
      form.firstName &&
      form.lastName &&
      form.address &&
      form.city &&
      form.governorate &&
      phoneRegex.test(form.phone)
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const orderNumber = `ORD-${Math.floor(Math.random() * 100000)}`;
    setLoading(true);

    const { error } = await supabase.from("orders").insert([{
      order_number: orderNumber,
      customer_name: form.firstName + " " + form.lastName,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: {
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        governorate: form.governorate,
        postal_code: form.postalCode
      },
      total_amount: totalAmount + shippingCost,
      status: "pending"
    }]);

    if (!error) {
      clearCart();
      setSuccess(true);

      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_oa4um6f",
          template_id: "template_1x5c6rc",
          user_id: "Qawtur4g0JW053ngs",
          template_params: {
            to_email: "moaaz5799@gmail.com",
            message: `New Order: ${form.firstName} ${form.lastName}, ${form.email}, ${form.phone}, ${form.address}, ${form.city}, ${form.governorate}, Cart: ${JSON.stringify(cartItems)}`
          }
        })
      });
    } else {
      alert("Order failed: " + error.message);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-8 text-green-600 text-xl text-center">
        Order placed successfully!
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-12">
      <form onSubmit={handleSubmit} className="w-full md:w-2/3 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>

          <input
            type="email"
            placeholder="Enter your Email"
            className="border w-full p-2"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input 
          placeholder="Phone" 
          className="border w-full p-2" 
          value={form.phone} 
          onChange={e => setForm({ ...form, phone: e.target.value })} 
          required 
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="border p-2" required />
            <input placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="border p-2" required />
            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="border p-2 col-span-2" required />
            <input placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={e => setForm({ ...form, apartment: e.target.value })} className="border p-2 col-span-2" />
            <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border p-2" required />
            <select
              value={form.governorate}
              onChange={e => setForm({ ...form, governorate: e.target.value })}
              className="border p-2"
              required
            >
              <option value="Cairo">Cairo</option>
              <option value="Giza">Giza</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Aswan">Aswan</option>
              <option value="Asyut">Asyut</option>
              <option value="Beheira">Beheira</option>
              <option value="Beni Suef">Beni Suef</option>
              <option value="Dakahlia">Dakahlia</option>
              <option value="Damietta">Damietta</option>
              <option value="Faiyum">Faiyum</option>
              <option value="Gharbia">Gharbia</option>
              <option value="Ismailia">Ismailia</option>
              <option value="Kafr El Sheikh">Kafr El Sheikh</option>
              <option value="Luxor">Luxor</option>
              <option value="Matrouh">Matrouh</option>
              <option value="Minya">Minya</option>
              <option value="Monufia">Monufia</option>
              <option value="New Valley">New Valley</option>
              <option value="North Sinai">North Sinai</option>
              <option value="Port Said">Port Said</option>
              <option value="Qalyubia">Qalyubia</option>
              <option value="Qena">Qena</option>
              <option value="Red Sea">Red Sea</option>
              <option value="Sharqia">Sharqia</option>
              <option value="Sohag">Sohag</option>
              <option value="South Sinai">South Sinai</option>
              <option value="Suez">Suez</option>
            </select>
            <input placeholder="Postal code (optional)" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} className="border p-2" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border p-2" required />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment</h2>
          <div className="border p-4">Cash on Delivery (COD)</div>
        </div>
        <button disabled={loading} type="submit" className="bg-black text-white py-3 px-6 mt-4 w-full">
          {loading ? "Placing Order..." : "Complete Order"}
        </button>
      </form>

      <div className="w-full md:w-1/3 border p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
       {cartItems.map(item => (
      <div key={item.id} className="flex items-center justify-between gap-4 text-sm border-b py-2">
        <img
          src={item.products?.image_url || '/placeholder.svg'}
          alt={item.products?.title}
          className="w-12 h-12 object-cover border"
        />
        <div className="flex-1">
          <p className="font-medium">{item.products?.title}</p>
          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
        </div>
        <span>{((item.products?.sale_price || item.products?.price || 0) * item.quantity).toFixed(2)} EGP</span>
      </div>
      ))}
        <hr />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{totalAmount.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingCost.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated taxes</span>
          <span>0.00 EGP</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{(totalAmount + shippingCost).toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;