'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  Activity,
  CreditCard,
  PieChart,
  Wallet,
  Landmark,
  Calculator,
  Percent,
  Receipt,
  ArrowRight,
  Sparkles
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
    wastedPercentage = 100;
    recommendation = 'Cancel Immediately';
  } else if (usageFrequency >= 2 && usageFrequency <= 5) {
    wasteLevel = 'Moderate Waste';
    wastedPercentage = 50;
    recommendation = 'Consider Downgrading or Canceling';
  } else {
    wasteLevel = 'Worth Keeping';
    wastedPercentage = 0;
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
    if (taxableIncome <= 700000) {
      tax = 0; // Rebate limit
    } else {
      const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
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
        tax += remaining * 0.30;
      }
      tax = tax * 1.04; // Health and education cess
    }
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

const getCurrency = (country: string) => {
  if (country === 'India (New Regime)') return 'INR';
  if (country === 'UK') return 'GBP';
  return 'USD';
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
  const [activeTab, setActiveTab] = useState<'waste' | 'salary'>('waste');

  // Salary Calculator State
  const [salaryParams, setSalaryParams] = useState({
    annualSalary: '100000',
    deductions: '12000',
    country: 'US (Federal)'
  });

  const salaryResult = useMemo(() => {
    const annual = parseFloat(salaryParams.annualSalary) || 0;
    const ded = parseFloat(salaryParams.deductions) || 0;
    return calculateNetSalary(annual, ded, salaryParams.country);
  }, [salaryParams]);

  // Waste Calculator State
  const [subscriptions, setSubscriptions] = useState<SubscriptionResult[]>([
    { ...calculateSubscriptionWaste('Design Tool Pro', 49, 1), id: '1' },
    { ...calculateSubscriptionWaste('Cloud Storage', 15, 20), id: '2' },
    { ...calculateSubscriptionWaste('Marketing Automation', 99, 4), id: '3' },
  ]);

  const [formParams, setFormParams] = useState({
    name: '',
    monthlyCost: '',
    usageFrequency: '',
  });

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

  const overallWastePercentage = totals.yearlyCost === 0 
    ? 0 
    : Math.round((totals.wastedAmount / totals.yearlyCost) * 100);

  const [aiBleedInsight, setAiBleedInsight] = useState('');
  const [aiSalaryInsight, setAiSalaryInsight] = useState('');
  const [isAnalyzingBleed, setIsAnalyzingBleed] = useState(false);
  const [isAnalyzingSalary, setIsAnalyzingSalary] = useState(false);

  useEffect(() => {
    let active = true;
    if (subscriptions.length > 0) {
      setTimeout(() => setIsAnalyzingBleed(true), 0);
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bleed', data: subscriptions.map(s => ({ name: s.name, cost: s.yearly_cost, usage: s.usage })) })
      })
      .then(res => res.json())
      .then(data => {
        if (active) {
          setAiBleedInsight(data.text);
          setIsAnalyzingBleed(false);
        }
      })
      .catch(() => { if (active) setIsAnalyzingBleed(false); });
    }
    return () => { active = false; };
  }, [subscriptions]);

  useEffect(() => {
    let active = true;
    setTimeout(() => setIsAnalyzingSalary(true), 0);
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'salary', data: salaryResult })
    })
    .then(res => res.json())
    .then(data => {
      if (active) {
        setAiSalaryInsight(data.text);
        setIsAnalyzingSalary(false);
      }
    })
    .catch(() => { if (active) setIsAnalyzingSalary(false); });
    return () => { active = false; };
  }, [salaryResult]);

  const aiAdvisor = useMemo(() => {
    const cancelable = subscriptions
      .filter(s => s.waste_level !== 'Worth Keeping')
      .sort((a, b) => b.wasted_amount - a.wasted_amount)
      .slice(0, 3);

    const savings = cancelable.reduce((acc, curr) => acc + curr.yearly_cost, 0);

    const recommendations = cancelable.map(sub => {
      let advice = '';
      if (sub.waste_level === 'High Waste') {
        advice = `Cancel immediately. 100% of your ${formatCurrency(sub.yearly_cost)}/yr is wasted over ${sub.usage}x/mo usage.`;
      } else {
        advice = `Downgrade or cancel. You only use it ${sub.usage}x/mo. Exploring cheaper alternatives will save ${formatCurrency(sub.yearly_cost)}/yr.`;
      }
      return { ...sub, advice };
    });

    return { recommendations, savings };
  }, [subscriptions]);

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParams.name || !formParams.monthlyCost || !formParams.usageFrequency) return;

    const result = calculateSubscriptionWaste(
      formParams.name,
      parseFloat(formParams.monthlyCost),
      parseInt(formParams.usageFrequency, 10)
    );

    setSubscriptions((prev) => [
      ...prev,
      { ...result, id: Math.random().toString(36).substr(2, 9) }
    ]);
    
    setFormParams({ name: '', monthlyCost: '', usageFrequency: '' });
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };


  const currentCurrency = activeTab === 'salary' ? getCurrency(salaryParams.country) : 'USD';

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
    <main className="min-h-screen p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-space font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Landmark className="w-8 h-8 text-blue-600" />
            Financial Toolkit
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Optimize your SaaS subscriptions and calculate your net salary.
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('waste')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'waste' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            SaaS Bleed
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'salary' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Salary Calc
          </button>
        </div>
      </header>

      {activeTab === 'waste' ? (
        <div
          key="waste-tab"
          className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Headline & Instant Input */}
          <div className="text-center pt-4 sm:pt-8 mb-8">
            <h2 className="text-4xl sm:text-5xl font-space font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Stop bleeding money <br className="hidden sm:block" /> on unused SaaS.
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              Find out exactly how much cash you&apos;re burning on subscriptions and get instant cancellation links.
            </p>

            <form 
              onSubmit={handleAddSubscription} 
              className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 p-2 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center relative z-10 mx-auto"
            >
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  required
                  value={formParams.name}
                  onChange={(e) => setFormParams({ ...formParams, name: e.target.value })}
                  placeholder="App name (e.g. Netflix)"
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="w-full sm:w-32 border-t sm:border-t-0 sm:border-l border-gray-100 flex-shrink-0">
                <div className="relative h-full flex items-center">
                  <span className="absolute left-3 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formParams.monthlyCost}
                    onChange={(e) => setFormParams({ ...formParams, monthlyCost: e.target.value })}
                    placeholder="Cost/mo"
                    className="w-full pl-7 pr-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>
              <div className="w-full sm:w-36 border-t sm:border-t-0 sm:border-l border-gray-100 flex-shrink-0">
                <input
                  type="number"
                  required
                  min="0"
                  value={formParams.usageFrequency}
                  onChange={(e) => setFormParams({ ...formParams, usageFrequency: e.target.value })}
                  placeholder="Uses/mo"
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="pt-2 sm:pt-0 sm:pl-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 px-8 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  Add
                </button>
              </div>
            </form>
          </div>

          {subscriptions.length > 0 && (
            <div 
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 pt-8 animate-in zoom-in-95 duration-300"
            >
              {/* Total Bleed Visual */}
              <div className="text-center border-b border-gray-100 pb-8 mb-8">
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-3 font-mono">Current Yearly Bleed</p>
                <div className="flex justify-center items-center gap-2">
                  <span className={`text-6xl sm:text-7xl font-space font-extrabold tracking-tighter ${totals.wastedAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {formatCurrency(totals.wastedAmount)}
                  </span>
                </div>
                {totals.wastedAmount > 0 ? (
                  <p className="text-red-600/80 mt-3 text-sm font-medium">You are bleeding {overallWastePercentage}% of your total ${formatCurrency(totals.yearlyCost)}/yr SaaS budget.</p>
                ) : (
                  <p className="text-emerald-600/80 mt-3 text-sm font-medium">Zero bleed! You are using all your subscriptions effectively.</p>
                )}
                <p className="text-gray-400 text-xs mt-2">*Estimates only</p>
              </div>

              {/* AI Insight */}
              {(aiBleedInsight || isAnalyzingBleed) && (
                <div className="mb-10 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    AI Bleed Analysis
                  </div>
                  <div className="text-sm text-blue-900 leading-relaxed font-medium">
                    {isAnalyzingBleed ? 'Analyzing your subscriptions...' : aiBleedInsight}
                  </div>
                </div>
              )}

              {/* Quick Actions (AI Advice & Cancellation) */}
              {aiAdvisor.recommendations.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-gray-900">Urgent Recommendations</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {aiAdvisor.recommendations.map(rec => (
                      <div key={`rec-${rec.id}`} className="bg-red-50/50 border border-red-100/50 p-5 rounded-2xl flex flex-col justify-between items-start gap-4 group">
                        <div>
                          <div className="text-red-950 font-bold text-lg mb-1">{rec.name}</div>
                          <div className="text-sm text-red-800/80 leading-relaxed font-medium">{rec.advice}</div>
                        </div>
                        <a 
                          href={`https://www.google.com/search?q=how+to+cancel+${encodeURIComponent(rec.name.toLowerCase())}+subscription`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-4 py-2.5 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors w-full sm:w-auto justify-center"
                        >
                          Cancel Now <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription List */}
              <div>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-semibold text-gray-900 text-sm">Tracked Subscriptions</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{subscriptions.length} Apps</span>
                </div>
                <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{sub.name}</div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            {formatCurrency(sub.yearly_cost)}/yr • {sub.usage} uses/mo
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getWasteBadgeStyle(sub.waste_level)}`}>
                          {sub.waste_level}
                        </span>
                        <button
                          onClick={() => removeSubscription(sub.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove subscription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          key="salary-tab"
          className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Headline & Instant Input */}
          <div className="text-center pt-4 sm:pt-8 mb-8">
            <h2 className="text-4xl sm:text-5xl font-space font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Real Monthly Salary. <br className="hidden sm:block" /> Post Tax & Inflation.
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              Calculate your exact take-home pay under the new regime. Protect your purchasing power.
            </p>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 p-2 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center relative z-10 mx-auto">
              <div className="flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100 flex-shrink-0">
                <select
                  value={salaryParams.country}
                  onChange={(e) => setSalaryParams({ ...salaryParams, country: e.target.value })}
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base font-semibold text-gray-900 cursor-pointer"
                >
                  <option value="US (Federal)">US (Federal Simplified)</option>
                  <option value="India (New Regime)">India (New Regime)</option>
                  <option value="UK">UK (Simplified)</option>
                </select>
              </div>
              <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-gray-100 flex-shrink-0">
                <div className="relative h-full flex items-center">
                  <span className="absolute left-3 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Annual Gross"
                    value={salaryParams.annualSalary}
                    onChange={(e) => setSalaryParams({ ...salaryParams, annualSalary: e.target.value })}
                    className="w-full pl-7 pr-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>
              <div className="w-full sm:w-40 border-b sm:border-b-0 border-gray-100 flex-shrink-0">
                <div className="relative h-full flex items-center">
                  <span className="absolute left-3 text-gray-400 font-medium">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Deductions"
                    value={salaryParams.deductions}
                    onChange={(e) => setSalaryParams({ ...salaryParams, deductions: e.target.value })}
                    className="w-full pl-7 pr-4 py-3 sm:py-4 bg-transparent border-none focus:ring-0 outline-none text-base placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 pt-8"
          >
            {/* Total Salary Visual */}
            <div className="text-center border-b border-gray-100 pb-8 mb-8">
              <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-3 font-mono">Monthly In-Hand</p>
              <div className="flex justify-center items-center gap-2">
                <span className="text-6xl sm:text-7xl font-space font-extrabold tracking-tighter text-emerald-600">
                  {formatCurrency(salaryResult.monthly_inhand, currentCurrency)}
                </span>
              </div>
              <p className="text-emerald-700/80 mt-3 text-sm font-medium">Net Takeaway (Annual: {formatCurrency(salaryResult.monthly_inhand * 12, currentCurrency)})</p>
              <p className="text-gray-400 text-xs mt-2">*Estimates only</p>
            </div>

            {/* AI Insight */}
            {(aiSalaryInsight || isAnalyzingSalary) && (
              <div className="mb-8 bg-purple-50/50 border border-purple-100 p-4 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  AI Salary Analysis 
                </div>
                <div className="text-sm text-purple-900 leading-relaxed font-medium">
                  {isAnalyzingSalary ? 'Analyzing your compensation structure...' : aiSalaryInsight}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-mono">Tax Obligation</span>
                <div className="text-3xl font-space font-bold text-gray-900 mt-1">
                  {formatCurrency(salaryResult.tax, currentCurrency)}
                </div>
                <span className="text-xs text-red-600/70 block mt-1 font-medium">
                  Total Yearly Tax Rate
                </span>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-mono">Real Value (6% Inflation)</span>
                <div className="text-3xl font-space font-bold text-gray-900 mt-1">
                  {formatCurrency(salaryResult.inflation_adjusted_monthly, currentCurrency)}
                </div>
                <span className="text-xs text-amber-700/70 block mt-1 font-medium bg-amber-50 w-fit px-2 py-0.5 rounded">
                  Monthly Purchasing Power
                </span>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </main>
  );
}
