import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import { getPublicProposal } from "./api/proposalApi";
import {CreditCard,Landmark,Wallet,Bitcoin,BadgeDollarSign,FileText,ShieldCheck,Download,ChevronRight,CheckCircle2,Sparkles,Receipt,Clock3,CircleDollarSign,Eye} from "lucide-react";

export default function ClientPaymentPage() {
  const { token } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("paystack");
  const [paymentPlan, setPaymentPlan] = useState("full");
  const [paymentData, setPaymentData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");
  const [customAmount, setCustomAmount] = useState("");
  const [initializingPayment, setInitializingPayment] = useState(false);

  const loadProposal = async () => {
  try {

    const data = await getPublicProposal(token);
    setProposal(data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    setLoading(false);
  }
};

 const isPaid = proposal?.invoiceStatus === "Paid";
const isPartial = proposal?.invoiceStatus === "PartiallyPaid";
const remaining = proposal?.balanceDue || 0; // UI only




  const initializePayment = async (invoiceId) => {
    try {
      setInitializingPayment(true);
      const initRes = await fetch(
        "http://localhost:5214/api/payment/initialize-public",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId,
            paymentPlan,
            token,
            customAmount: paymentPlan === "custom"
             ? Number(customAmount) 
             : null,
          }),
        }
      );
      const data = await initRes.json();
      console.log("Payment initialized:", data);
      setPaymentData(data);
    } catch (err) {
      console.error(err);
    }
      finally {setInitializingPayment(false);

      }
  };

const handlePay = async () => {
    try {
      if (!paymentData?.authorizationUrl) {
        alert("Payment not initialized");
        return;
      }

      window.location.href = paymentData.authorizationUrl;
    } catch (err) {
      console.error(err);
      alert("Failed to start payment");
    }
  };

  const verifyPayment = async (reference,
  invoiceId) => {
    const res = await fetch(
      "http://localhost:5214/api/payment/verify-public",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          
          invoiceId,
          reference
        }),
      }
    );

    await res.json();

    if (res.ok) {
      navigate(`/client/payment/${token}`);
    } else {
      navigate("/payment-failed");
    }
  };

  
  

  // NOTE: must not call hooks conditionally; just prevent initialization below
  // (actual initialization is controlled in useEffect)

  

///////////////////////////////////////////////////////////
// LOAD PROPOSAL
///////////////////////////////////////////////////////////
useEffect(() => {

  const fetchProposal = async () => {
    await loadProposal();
  };

  fetchProposal();

}, [token]);

///////////////////////////////////////////////////////////
// VERIFY CALLBACK
///////////////////////////////////////////////////////////
useEffect(() => {

  if (!reference || !proposal?.externalInvoiceId) 
    return;

  verifyPayment(reference,proposal.externalInvoiceId);

}, [reference, proposal?.externalInvoiceId]);



///////////////////////////////////////////////////////////
// INITIALIZE PAYMENT
///////////////////////////////////////////////////////////
useEffect(() => {

  // DO NOT initialize during callback flow
  if (reference) return;

  if (!proposal?.externalInvoiceId) return;

  // CUSTOM MODE REQUIRES VALID AMOUNT
  if (
    paymentPlan === "custom" &&
    (!customAmount || Number(customAmount) <= 0)
  ) {
    return;
  }

  const timeout = setTimeout(() => {

    initializePayment(
      proposal.externalInvoiceId
    );

  }, 500);

  return () => clearTimeout(timeout);

}, [
  paymentPlan,
  customAmount,
  proposal?.externalInvoiceId,
  reference
]);

  //End of Hooks///////////////////////////////////////////////////////////////////////////////
 


 const pricing = useMemo(
    () => normalizePricing(proposal?.pricingItems),
    [proposal]
  );
const total = useMemo(() => {
    return pricing.reduce(
      (sum, i) => sum + (i.qty || 0) * (i.price || 0),
      0
    );
  }, [pricing]);



const customAmountNumber = Number(customAmount || 0);
const projectedRemainingInvoice =
  paymentPlan === "custom"
    ? Math.max(
        remaining - customAmountNumber,
        0
      )
    : remaining;

    const projectedRemainingCheckout =
  projectedRemainingInvoice *
  (paymentData?.exchangeRate || 1);
const alreadyPaid = total - remaining;
  const projectedPaid =
  paymentPlan === "custom"
    ? alreadyPaid + customAmountNumber
    : alreadyPaid;

const cappedProjectedPaid = Math.min(
  projectedPaid,
  total
);

const progressPercentage = total
  ? Math.round(
      (cappedProjectedPaid / total) * 100
    )
  : 0;



const isCustomAmountValid =
  paymentPlan !== "custom"
    ? true
    : customAmountNumber > 0 &&
      customAmountNumber <= remaining;

 

 

  const currency = proposal?.currency || "$";
  const pdfUrl =
    proposal?.invoicePdfUrl ||
    proposal?.pdfUrl ||
    proposal?.invoice?.pdfUrl ||
    proposal?.invoice?.url ||
    proposal?.invoice?.href;

  

  const paymentMethods = [
    {
      id: "paystack",
      name: "Paystack",
      description: "Cards & Mobile Money",
      icon: CreditCard,
      recommended: true,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "International Cards",
      icon: BadgeDollarSign,
      comingSoon: true,
    },
    {
      id: "applepay",
      name: "Apple Pay",
      description: "Fast mobile checkout",
      icon: Wallet,
      comingSoon: true,
    },
    {
      id: "crypto",
      name: "Crypto",
      description: "BTC, ETH & USDT",
      icon: Bitcoin,
      comingSoon: true,
    },
    {
      id: "ach",
      name: "ACH Transfer",
      description: "US Bank Payments",
      icon: Landmark,
      comingSoon: true,
    },
    {
      id: "wise",
      name: "Wise",
      description: "International transfer",
      icon: ChevronRight,
      comingSoon: true,
    },
  ];

  if (loading) {
    return <Skeleton />;
  }

  if (!proposal) {
    return (
      <div className="p-10 text-red-500">
        Proposal not found
      </div>
    );
  }















  
  return (
    <ClientLayout proposal={proposal}>
      <div className="space-y-8">
       {/* HERO */}
<div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">

  {/* BACKGROUND GLOW */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full" />

  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

    {/* LEFT */}
    <div>

      {/* STATUS BADGE */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
          isPaid
            ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
            : isPartial
            ? "bg-amber-500/10 border-amber-400/20 text-amber-300"
            : "bg-white/5 border-white/10 text-slate-200"
        }`}
      >
        {isPaid ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Payment Successful
          </>
        ) : isPartial ? (
          <>
            <Clock3 className="w-4 h-4" />
            Partial Payment Received
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Secure Checkout
          </>
        )}
      </div>

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-white mt-5 leading-tight">

        {isPaid
          ? "Payment Completed Successfully"
          : isPartial
          ? "Complete Remaining Balance"
          : "Complete Your Payment"}

      </h1>

      {/* DESCRIPTION */}
      <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed text-lg">

        {isPaid
          ? "Your payment has been confirmed and your invoice is now fully settled. You can download your invoice documents below."
          : isPartial
          ? "Your deposit payment has been received successfully. Complete the remaining balance to finalize project activation."
          : "Review your invoice, choose your preferred payment method, and securely complete your payment to begin your project immediately."}

      </p>

      {/* META */}
      <div className="mt-6 flex flex-wrap gap-3">

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
          Invoice: {proposal.invoiceNumber}
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
          {proposal.title}
        </div>

      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-w-[300px]">

      <p className="text-slate-300 text-sm">

        {isPaid
          ? "Invoice Status"
          : isPartial
          ? "Remaining Balance"
          : "Total Amount Due"}

      </p>

      <h2 className="text-4xl font-bold text-white mt-2">
  {paymentData?.checkoutCurrency || currency}{" "}
  {isPaid
    ? "0.00"
    : paymentData
    ? projectedRemainingCheckout?.toLocaleString()
    : remaining?.toLocaleString?.()}
</h2>

      {/* STATUS */}
      <div
        className={`mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl ${
          isPaid
            ? "bg-emerald-500/10 text-emerald-300"
            : isPartial
            ? "bg-amber-500/10 text-amber-300"
            : "bg-white/5 text-slate-200"
        }`}
      >
        {isPaid ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Paid
          </>
        ) : isPartial ? (
          <>
            <Clock3 className="w-4 h-4" />
            Outstanding Balance
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            SSL Secure Checkout
          </>
        )}
      </div>

      {/* PARTIAL PAYMENT PROGRESS */}
      {isPartial && (
        <div className="mt-6">

          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Payment Progress</span>

            <span>
              {progressPercentage}%
            </span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">

            <div
              className="h-full bg-amber-400 rounded-full"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>
        </div>
      )}
    </div>
  </div>
</div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            {/* INVOICE SUMMARY */}
            <SectionCard
              title="Invoice Summary"
              icon={<Receipt className="w-5 h-5" />}
            >
              <div className="space-y-4">
                {/* LINE ITEMS */}
                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200/60 overflow-hidden">
                  {pricing.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600">
                            Qty: {item.qty}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
                            {currency} {item.price.toLocaleString()}/unit
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Line Total
                        </p>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          {currency} {(item.qty * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                
                {/* TOTALS */}
                    <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-900">
                          {currency} {total.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                        <span>Processing Fee</span>
                        <span className="font-medium text-slate-900">
                          {currency} 0.00
                        </span>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">
                            {isPaid ? "Total Paid" : "Total Due"}
                          </p>

                          <h3 className="text-2xl font-bold text-slate-900 mt-1">
                            {currency}{" "}
                            {isPaid
                              ? total.toLocaleString()
                              : remaining?.toLocaleString?.() ?? paymentData.checkoutAmount?.toLocaleString()}
                          </h3>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : isPartial
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isPaid
                            ? "Paid"
                            : isPartial
                            ? "Partially Paid"
                            : "Payment Pending"}
                        </div>
                      </div>
                    </div>
              </div>
            </SectionCard>

            {/* FLEXIBLE PAYMENTS */}
            <SectionCard
  title="Flexible Payment Options"
  icon={<CircleDollarSign className="w-5 h-5" />}
>
  {isPaid ? (
    <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-medium">
      This invoice has been fully paid. No further payment required.
    </div>
  ) : (
    <div className="space-y-4">

     
      {/* FULL PAYMENT */}
      <button
        onClick={() => {
          setPaymentPlan("full");
          setCustomAmount("");
        }}
        className={`cursor-pointer w-full border rounded-2xl p-5 text-left transition-all ${
          paymentPlan === "full"
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-900">
              {isPartial
                ? "Pay Remaining Balance"
                : "Pay Full Amount"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {isPartial
                ? "Complete the outstanding invoice payment"
                : "One-time secure payment"}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg">
              {currency}{" "}
              {(isPartial
                ? proposal?.balanceDue
                : total
              )?.toLocaleString()}
            </p>
          </div>
        </div>
      </button>

      {/* DEPOSIT OPTION */}
      {!isPartial && (
        <button
          onClick={() => {
            setPaymentPlan("deposit");
            setCustomAmount("");
          }}
          className={`cursor-pointer w-full border rounded-2xl p-5 text-left transition-all ${
            paymentPlan === "deposit"
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">
                50% Deposit
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Pay remaining balance later
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg">
                {currency}{" "}
                {(total * 0.5).toLocaleString()}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* CUSTOM PAYMENT */}
      <div
        onClick={() => setPaymentPlan("custom")}
        className={`cursor-pointer border rounded-2xl p-5 transition-all ${
          paymentPlan === "custom"
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-slate-900">
              Custom Payment Amount
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Choose how much you want to pay today
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              Max
            </p>

            <p className="font-bold text-lg">
              {currency}{" "}
              {proposal?.balanceDue?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* INPUT */}
        {paymentPlan === "custom" && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter Payment Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                {currency}
              </span>

              <input
                type="number"
                min="1"
                max={proposal?.balanceDue}
                value={customAmount}
                onChange={(e) =>
                  setCustomAmount(e.target.value)
                }
                placeholder="Enter amount"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <p className="text-xs text-slate-500 mt-2">
              You can make multiple partial payments until the invoice is fully settled.
            </p>
          </div>
        )}
      </div>
    </div>
  )}
</SectionCard>



                        

           {/* PAYMENT EXPERIENCE */}
{isPaid ? (

  /* =========================
     PAID STATE
  ========================= */
  <div className="space-y-6">

    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Payment Completed
          </h2>

          <p className="text-slate-600 mt-2">
            Your payment has been successfully verified and your
            project is now ready to begin.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Invoice
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {proposal.invoiceNumber}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Amount Paid
              </p>

              <p className="font-semibold text-emerald-700 mt-1">
                {currency} {total.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Status
              </p>

              <p className="font-semibold text-emerald-700 mt-1">
                Paid
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

    {/* DOCUMENT ACTIONS */}
    <SectionCard
      title="Invoice Documents"
      icon={<FileText className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-4 hover:bg-slate-50 transition"
        >
          <Eye className="w-5 h-5 text-slate-700" />

          <span className="font-medium">
            View Invoice
          </span>
        </a>

        <a
          href={pdfUrl}
          download
          className="flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-4 hover:bg-slate-50 transition"
        >
          <Download className="w-5 h-5 text-slate-700" />

          <span className="font-medium">
            Download PDF
          </span>
        </a>

      </div>
    </SectionCard>
  </div>

) : (

  /* =========================
     PAYMENT STATE
  ========================= */
  <>
    {/* PAYMENT METHODS */}
    <SectionCard
      title="Choose Payment Method"
      icon={<CreditCard className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() =>
                !item.comingSoon && setMethod(item.id)
              }
              className={`relative border rounded-2xl p-5 text-left transition-all
              ${
                method === item.id
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
              ${
                item.comingSoon
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-slate-700" />
                </div>

                <div className="flex gap-2">
                  {item.recommended && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      Recommended
                    </span>
                  )}

                  {item.comingSoon && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>

              {method === item.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>

    
    {/* PAYMENT BUTTON */}
<div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

  {/* PAYMENT SUMMARY */}
  {paymentData && (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">

      <div className="flex justify-between text-sm">
        <span className="text-slate-500">
          Invoice Amount
        </span>

        <span className="font-medium text-slate-800">
          {paymentData.invoiceCurrency}{" "}
          {paymentData.invoiceAmount?.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between text-sm mt-3">
        <span className="text-slate-500">
          Exchange Rate
        </span>

        <span className="font-medium text-slate-800">
          1 {paymentData.invoiceCurrency} ={" "}
          {paymentData.exchangeRate}{" "}
          {paymentData.checkoutCurrency}
        </span>
      </div>

      <div className="border-t border-slate-200 my-3"></div>

      <div className="flex justify-between font-semibold">
        <span className="text-slate-900">
          Payable Today<p className="text-xs text-slate-400 mt-2">Final amount may vary slightly depending on your bank or card issuer.</p>
        </span>

        <span className="text-emerald-600">
          {paymentData.checkoutCurrency}{" "}
          {paymentData.checkoutAmount?.toLocaleString()}
          
        </span>
        
        
      </div>
    </div>
  )}

  {/* PAY BUTTON */}
  <button
    disabled={!paymentData || !isCustomAmountValid}
    onClick={handlePay}
    className={` cursor-pointer w-full py-4 rounded-2xl text-lg font-semibold transition-all
      ${!paymentData || !isCustomAmountValid
        ? "bg-slate-300 cursor-not-allowed"
        : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
      }`}
  >
    {initializingPayment
 ? "Updating Payment Value..."
 : `Pay ${paymentData?.checkoutCurrency || currency}
 ${paymentData?.checkoutAmount?.toLocaleString?.() || "0.00"}`
}
  </button>

  {/* FOOTER */}
  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
    <ShieldCheck className="w-4 h-4 text-emerald-600" />
    Secure payment powered by Paystack
  </div>

</div>
  </>
)}
</div>

          
          

          {/* RIGHT PANEL */}
          <div className="space-y-5">
            <div className="sticky top-6 space-y-5">
              {/* INVOICE CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Invoice
                    </p>

                    <h3 className="font-bold text-slate-900 mt-1 text-lg">
                      {proposal.invoiceNumber || "Not Yet Invoiced"}
                    </h3>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    {proposal?.invoiceStatus || "Pending"}
                  </div>
                </div>

                <div className="aspect-[4/5] bg-white rounded-xl border overflow-hidden">
  {pdfUrl ? (
    <object
      data={`${pdfUrl}#toolbar=0&navpanes=0`}
      type="application/pdf"
      className="w-full h-full"
    >
      <p className="text-sm text-slate-500 p-4">
        PDF preview not supported. 
        <a href={pdfUrl} target="_blank" className="text-emerald-600 underline ml-1">
          Open PDF
        </a>
      </p>
    </object>
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <FileText className="w-12 h-12 text-slate-300" />
      <p className="text-sm text-slate-400 mt-3">Invoice Preview not available</p>
    </div>
  )}
</div>

                <div className="mt-5 space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition cursor-pointer">
                    <a
                      href={pdfUrl}
                      download
                      className="flex items-center justify-center gap-2 w-full font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </button>

                  <button className=" cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition">
                    <FileText className="w-4 h-4" />
                    View Full Invoice
                  </button>
                </div>
              </div>

              {/* PROJECT CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">
                  Project Details
                </h3>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {proposal.title || "Project Agreement"}
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>

                    <span className="font-medium text-emerald-600">
                      Ready to Start
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Payment Type</span>

                    <span className="font-medium text-slate-800">
                      {paymentPlan === "deposit"
                        ? "Deposit"
                        : "Full Payment"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Due</span>

                    <span className="font-medium text-slate-800">
                      Immediate
                    </span>
                  </div>
                </div>
              </div>

              {/* SECURITY */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>

                <h3 className="font-semibold text-lg mt-5">
                  Secure Payment
                </h3>

                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Your payment is encrypted and securely processed
                  through trusted payment infrastructure.
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    SSL Encrypted Checkout
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    PCI Compliant Providers
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instant Payment Confirmation
                  </div>
                </div>
              </div>

              {/* SUPPORT */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Clock3 className="w-5 h-5 text-slate-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Need Assistance?
                    </h3>

                    <p className="text-sm text-slate-500">
                      We are here to help
                    </p>
                  </div>
                </div>

                <button className="cursor-pointer mt-5 w-full bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

/* ---------- HELPERS ---------- */

function normalizePricing(items) {
  if (!Array.isArray(items)) return [];

  return items.map((x) => ({
    name: x.name || x.title || x.Name,
    description: x.description || x.Description,
    qty: Number(x.qty || x.quantity || 1),
    price: Number(x.price || x.unitPrice || x.Price),
  }));
}

/* ---------- REUSABLE ---------- */

function SectionCard({ title, icon, children }) {
  return (
    <div className="rounded-3xl p-6 border border-slate-200 shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
          {icon}
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="p-10 animate-pulse space-y-6">
      <div className="h-40 bg-slate-300 rounded-3xl" />
      <div className="h-72 bg-slate-300 rounded-3xl" />
      <div className="h-72 bg-slate-300 rounded-3xl" />
    </div>
  );
}