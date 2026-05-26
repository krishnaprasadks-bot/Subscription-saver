'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Plus, 
  Trash2, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  Activity,
  CreditCard,
  Wallet,
  Landmark,
  Calculator,
  Percent,
  Receipt,
  ArrowRight
} from 'lucide-react';

/**
 * Core Logic Function: SaaS Subscription Waste Calculator
 * 
 * Takes in subscription details and calculates financial waste
 * and actionable recommendations based on monthly usage frequency.
 */
function calculateSubscriptionWaste(
  name: string,
  monthlyCost: number,
  usageFrequency: number
) {
  const yearlyCost = monthlyCost * 12;
  
  let wasteLevel: 'High Waste' | 'Moderate Waste' | 'Worth Keeping' = 'Worth Keeping';
  let wastedPercentage = 0;
  let recommendation = '';

  if (usageFrequency < 2) {
    wasteLevel = 'High Waste';
    wastedPercentage = 80;
    recommendation = 'Cancel Immediately';
  } else if (usageFrequency >= 2 && usageFrequency <= 5) {
    wasteLevel = 'Moderate Waste';
    wastedPercentage = 40;
    recommendation = 'Consider Downgrading or Canceling';
  } else {
    wasteLevel = 'Worth Keeping';
    wastedPercentage = 10;
    recommendation = 'Keep Active';
  }

  const wastedAmount = (yearlyCost * wastedPercentage) / 100;

  return {
    name,
    yearly_cost: yearlyCost,
    usage: usageFrequency,
    waste_level: wasteLevel,
    wasted_percentage: wastedPercentage,
    wasted_amount: wastedAmount,
    recommendation,
  };
}

/**
 * Core Logic Function: Net Salary & Tax Calculator
 * 
 * Takes annual salary, deductions, and country to calculate
 * tax, monthly in-hand, and inflation-adjusted value.
 */
function calculateNetSalary(annualSalary: number, deductions: number, country: string) {
  const taxableIncome = Math.max(0, annualSalary - deductions);
  let tax = 0;

  if (country === 'India (New Regime)') {
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
    else tax = 150000 + (taxableIncome - 1500000) * 0.3;
  } else if (country === 'US (Federal)') {
    const slabs = [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
    ];
    let remaining = taxableIncome;
    let previousLimit = 0;
    for (const slab of slabs) {
      if (remaining > 0) {
        const taxableInSlab = Math.min(remaining, slab.limit - previousLimit);
        tax += taxableInSlab * slab.rate;
        remaining -= taxableInSlab;
        previousLimit = slab.limit;
      }
    }
    if (remaining > 0) {
      tax += remaining * 0.37;
    }
  } else if (country === 'UK') {
    const slabs = [
      { limit: 37700, rate: 0.20 },
      { limit: 125140, rate: 0.40 },
    ];
    let remaining = taxableIncome;
    let previousLimit = 0;
    for (const slab of slabs) {
      if (remaining > 0) {
        const taxableInSlab = Math.min(remaining, slab.limit - previousLimit);
        tax += taxableInSlab * slab.rate;
        remaining -= taxableInSlab;
        previousLimit = slab.limit;
      }
    }
    if (remaining > 0) {
      tax += remaining * 0.45;
    }
  }

  const monthlyInHand = (annualSalary - tax) / 12;
  const inflationAdjustedMonthly = monthlyInHand / 1.06; // Assuming 6% inflation

  return {
    gross_salary: annualSalary,
    taxable_income: taxableIncome,
    tax: Math.round(tax),
    monthly_inhand: Math.round(monthlyInHand),
    inflation_adjusted_monthly: Math.round(inflationAdjustedMonthly)
  };
}

const cancelLinks: Record<string, string> = {
  "Netflix": "https://www.netflix.com/cancelplan",
  "Spotify": "https://www.spotify.com/account/cancel/",
  "Amazon Prime": "https://www.amazon.com/mc/pipelines/cancellation",
  "Adobe": "https://account.adobe.com/plans",
};

const getCurrencySymbol = (currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency })
    .formatToParts(0)
    .find(p => p.type === 'currency')?.value || '$';
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Type for the function output
type SubscriptionResult = ReturnType<typeof calculateSubscriptionWaste> & { id: string };

export default function FinancialToolkit() {
  // Salary Calculator State
  const [salaryParams, setSalaryParams] = useState({
    annualSalary: '100000',
    deductions: '12000',
    country: 'US (Federal)'
  });

  const [globalCurrency, setGlobalCurrency] = useState('USD');

  // Waste Calculator State
  const [subscriptions, setSubscriptions] = useState<SubscriptionResult[]>([
    { ...calculateSubscriptionWaste('Netflix', 15.49, 1), id: '1' },
    { ...calculateSubscriptionWaste('Spotify', 10.99, 20), id: '2' },
    { ...calculateSubscriptionWaste('Amazon Prime', 14.99, 4), id: '3' },
  ]);

  const totals = useMemo(() => {
    return subscriptions.reduce(
      (acc, curr) => {
        acc.yearlyCost += curr.yearly_cost;
        acc.wastedAmount += curr.wasted_amount;
        return acc;
      },
      { yearlyCost: 0, wastedAmount: 0 }
    );
  }, [subscriptions]);

  const salaryResult = useMemo(() => {
    const annual = parseFloat(salaryParams.annualSalary) || 0;
    const ded = totals.yearlyCost;
    return calculateNetSalary(annual, ded, salaryParams.country);
  }, [salaryParams.annualSalary, salaryParams.country, totals.yearlyCost]);

  const [formParams, setFormParams] = useState({
    name: '',
    monthlyCost: '',
    usageFrequency: '',
  });

  const overallWastePercentage = totals.yearlyCost === 0 
    ? 0 
    : Math.round((totals.wastedAmount / totals.yearlyCost) * 100);

  const aiAdvisor = useMemo(() => {
    const cancelable = subscriptions
      .filter(s => s.waste_level !== 'Worth Keeping')
      .sort((a, b) => b.wasted_amount - a.wasted_amount)
      .slice(0, 3);

    const savings = cancelable.reduce((acc, curr) => acc + curr.yearly_cost, 0);

    const recommendations = cancelable.map(sub => {
      let advice = '';
      if (sub.waste_level === 'High Waste') {
        advice = `Cancel immediately. 80% of your ${formatCurrency(sub.yearly_cost, globalCurrency)}/yr is wasted over ${sub.usage}x/mo usage.`;
      } else {
        advice = `Downgrade or cancel. You only use it ${sub.usage}x/mo. Exploring cheaper alternatives will save you significantly.`;
      }
      return { ...sub, advice };
    });

    return { recommendations, savings };
  }, [subscriptions, globalCurrency]);

  const updateSubscription = (id: string, updates: { name?: string, monthlyCost?: number, usageFrequency?: number }) => {
    setSubscriptions((prev) => prev.map((sub) => {
      if (sub.id !== id) return sub;
      const newName = updates.name !== undefined ? updates.name : sub.name;
      const newCost = updates.monthlyCost !== undefined ? updates.monthlyCost : (sub.yearly_cost / 12);
      const newUsage = updates.usageFrequency !== undefined ? updates.usageFrequency : sub.usage;
      const result = calculateSubscriptionWaste(newName, newCost, newUsage);
      return { ...result, id };
    }));
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const getWasteBadgeStyle = (level: string) => {
    switch (level) {
      case 'High Waste':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Moderate Waste':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Worth Keeping':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getWasteIcon = (level: string) => {
    switch (level) {
      case 'High Waste':
        return <AlertCircle className="w-4 h-4 mr-1 text-red-600" />;
      case 'Moderate Waste':
        return <TrendingDown className="w-4 h-4 mr-1 text-amber-600" />;
      case 'Worth Keeping':
        return <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F14] text-white p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-6 h-6 text-[#22C55E]" />
              <span className="font-space font-bold tracking-tight text-xl">Subscription Saver</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-space font-extrabold tracking-tight text-white">
              Stop Wasting Money Instantly.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 font-medium">Currency</label>
            <select
              value={globalCurrency}
              onChange={(e) => setGlobalCurrency(e.target.value)}
              className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22C55E] cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </header>

        {/* Top Grid: SaaS Bleed Calculator */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* LEFT: INPUT PANEL */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold font-space text-white mb-2">Your Subscriptions</h2>
              <p className="text-sm text-gray-400 mb-6">Update your subscriptions to reveal your true yearly waste.</p>
              
              <div className="flex flex-col gap-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="grid grid-cols-12 gap-2 items-center relative group">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => updateSubscription(sub.id, { name: e.target.value })}
                        placeholder="App name"
                        className="w-full bg-[#0B0F14] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22C55E] placeholder:text-gray-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-4 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{getCurrencySymbol(globalCurrency)}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sub.yearly_cost ? sub.yearly_cost / 12 : ''}
                        onChange={(e) => updateSubscription(sub.id, { monthlyCost: parseFloat(e.target.value) || 0 })}
                        placeholder="Cost/mo"
                        className="w-full bg-[#0B0F14] border border-gray-800 rounded-lg pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-[#22C55E] placeholder:text-gray-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        value={sub.usage || ''}
                        onChange={(e) => updateSubscription(sub.id, { usageFrequency: parseInt(e.target.value, 10) || 0 })}
                        placeholder="Uses"
                        className="w-full bg-[#0B0F14] border border-gray-800 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#22C55E] placeholder:text-gray-600 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => removeSubscription(sub.id)}
                      className="absolute -right-8 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-[#EF4444] transition-all p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => setSubscriptions([...subscriptions, { ...calculateSubscriptionWaste('', 0, 0), id: Math.random().toString(36).substr(2,9) }])}
                  className="w-full bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 border border-[#22C55E]/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Another
                </button>
              </div>
            </div>

            {/* Removed mini tracked list as we now edit inline */}
          </div>

            {/* RIGHT: LIVE RESULTS PANEL */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col items-center">
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${totals.wastedAmount > 0 ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`} />

            <div className="w-full text-center pb-6 border-b border-gray-800 mb-6 flex flex-col md:flex-row items-center justify-center gap-8">
              <div>
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2 font-mono">Total Yearly Waste</p>
                <div className={`text-5xl md:text-6xl font-space font-extrabold tracking-tighter transition-colors ${totals.wastedAmount > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                  {formatCurrency(totals.wastedAmount, globalCurrency)}
                </div>
                {totals.wastedAmount > 0 ? (
                  <>
                    <p className="text-[#EF4444]/80 mt-2 text-sm font-medium">Bleeding {overallWastePercentage}% of your {formatCurrency(totals.yearlyCost, globalCurrency)}/yr budget.</p>
                    <p className="text-orange-400 mt-1 text-sm font-bold flex items-center gap-1"><span className="text-base">🔥</span> You&apos;re wasting more than 72% of users</p>
                  </>
                ) : (
                  <p className="text-[#22C55E]/80 mt-2 text-sm font-medium">Zero waste detected.</p>
                )}
              </div>
              
              {totals.yearlyCost > 0 && (
                <div className="w-32 h-32 md:w-40 md:h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Wasted", value: totals.wastedAmount },
                          { name: "Used", value: totals.yearlyCost - totals.wastedAmount }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={50}
                        innerRadius={35}
                        stroke="none"
                      >
                        <Cell fill="#EF4444" />
                        <Cell fill="#22C55E" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                        formatter={(value: any) => formatCurrency(Number(value) || 0, globalCurrency)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* AI Advisor / Cancel Actions */}
            <div className="w-full">
              {aiAdvisor.recommendations.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-[#EF4444] font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Action Required - Save {formatCurrency(aiAdvisor.savings, globalCurrency)} instantly!
                  </div>
                </div>
                
                <div className="space-y-3">
                  {aiAdvisor.recommendations.map(rec => (
                    <div key={`rec-${rec.id}`} className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#EF4444]/40 transition-colors">
                      <div>
                        <div className="text-white font-bold">{rec.name}</div>
                        <div className="text-xs text-red-300/80 mt-1">{rec.advice}</div>
                      </div>
                      <a 
                        href={cancelLinks[rec.name] || `https://www.google.com/search?q=how+to+cancel+${encodeURIComponent(rec.name.toLowerCase())}+subscription`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444] hover:text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Cancel <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center w-full">
                <CheckCircle2 className="w-12 h-12 text-[#22C55E]/20 mb-3" />
                <p className="text-gray-500 text-sm">Add your subscriptions on the left.<br/>Live waste metrics will appear here.</p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Bottom Strip: Net Pay Calculator */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
            <div className="lg:w-1/3">
              <h2 className="text-lg font-bold font-space text-white flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                Net Pay Calculator
              </h2>
              <p className="text-xs text-gray-400">See your true monthly take-home pay after tax and 6% inflation. *Estimates only.</p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Tax System</label>
                <select
                  value={salaryParams.country}
                  onChange={(e) => setSalaryParams({ ...salaryParams, country: e.target.value })}
                  className="w-full bg-[#0B0F14] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="US (Federal)">US (Federal)</option>
                  <option value="India (New Regime)">India (New)</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="relative">
                 <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Gross Annual</label>
                 <input
                    type="number"
                    value={salaryParams.annualSalary}
                    onChange={(e) => setSalaryParams({ ...salaryParams, annualSalary: e.target.value })}
                    className="w-full bg-[#0B0F14] border border-gray-700 rounded-lg pl-3 pr-2 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
              </div>
               <div className="relative">
                 <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Subscriptions (Deduction)</label>
                 <div className="w-full bg-[#0B0F14] border border-gray-800 rounded-lg pl-3 pr-2 py-2 text-sm text-gray-400">
                   {formatCurrency(totals.yearlyCost, globalCurrency)}
                 </div>
              </div>

              <div className="bg-[#0B0F14] border border-[#22C55E]/30 rounded-lg p-2 text-center h-full flex flex-col justify-center">
                 <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Monthly Net</span>
                 <div className="text-xl font-bold font-space text-[#22C55E]">
                   {formatCurrency(salaryResult.monthly_inhand, globalCurrency)}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Tiny Accordion */}
        <div className="pt-8">
          <details className="group border border-gray-800 bg-[#111827]/50 rounded-xl">
             <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-xs text-gray-400 hover:text-gray-300">
               <span>Frequently Asked Questions</span>
               <span className="transition group-open:rotate-180">
                 <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
               </span>
             </summary>
             <div className="text-gray-500 text-xs px-4 pb-4 space-y-4">
                <div>
                  <strong className="text-gray-300 block mb-1">How to cancel a subscription?</strong>
                  Use our SaaS Bleed Calculator above. Simply enter your subscriptions and it will generate direct cancellation links for Netflix, Spotify, Amazon Prime, and more.
                </div>
                <div>
                  <strong className="text-gray-300 block mb-1">How much money is wasted on subscriptions?</strong>
                  The average person wastes hundreds of dollars a year on unused SaaS. Calculate your exact yearly waste instantly using our tool.
                </div>
                 <div>
                  <strong className="text-gray-300 block mb-1">How to calculate monthly salary after tax in India?</strong>
                  Select &quot;India (New Regime)&quot; in our Net Pay Calculator to instantly see your monthly in-hand salary, adjusted for progressive tax brackets and inflation.
                </div>
             </div>
          </details>
        </div>

      </div>
      
      {/* Basic Custom Scrollbar for mini list */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 10px;
        }
      `}} />
    </main>
  );
}
