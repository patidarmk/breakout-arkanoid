import * as React from "react";
import { showSuccess } from "@/utils/toast";

const Contact = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    showSuccess("Thanks — your message has been sent!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="text-gray-600 mt-2">We're happy to help — report issues or request features below.</p>

      <form onSubmit={submit} className="mt-6 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm text-gray-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded" rows={5} required />
        </div>

        <div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send Message</button>
        </div>
      </form>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Other ways to reach us</h3>
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          <li>Email: support@arcanebreaker.example</li>
          <li>Twitter: @ArcaneBreaker</li>
          <li>FAQ & Docs: <a href="#" className="text-indigo-600 hover:underline">docs.arcanebreaker.example</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;