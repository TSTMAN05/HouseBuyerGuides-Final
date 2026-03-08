"use client";

import { useState } from "react";
import Link from "next/link";

export default function EligibilityForm() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    firstTime: "",
    primaryResidence: "",
    state: "",
    income: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      setSubmitted(true);
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const canNext = () => {
    if (step === 1) return !!answers.firstTime;
    if (step === 2) return !!answers.primaryResidence;
    if (step === 3) return !!answers.state;
    if (step === 4) return !!answers.income;
    return false;
  };

  const stateSlug = answers.state === "nc" ? "north-carolina" : answers.state === "sc" ? "south-carolina" : null;

  return (
    <div className="mx-auto max-w-xl">
      {!submitted ? (
        <>
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded ${
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
                aria-hidden
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Are you a first-time homebuyer?
              </h2>
              <p className="text-sm text-gray-600">
                Many programs define this as not having owned a home in the past 3 years.
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "unsure", label: "Not sure" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <input
                      type="radio"
                      name="firstTime"
                      value={value}
                      checked={answers.firstTime === value}
                      onChange={() => update("firstTime", value)}
                      className="h-4 w-4 border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Will you live in the home as your primary residence?
              </h2>
              <p className="text-sm text-gray-600">
                Most down payment assistance programs require the home to be your main residence, not an investment or second home.
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <input
                      type="radio"
                      name="primaryResidence"
                      value={value}
                      checked={answers.primaryResidence === value}
                      onChange={() => update("primaryResidence", value)}
                      className="h-4 w-4 border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Which state are you looking to buy in?
              </h2>
              <div className="space-y-2">
                {[
                  { value: "nc", label: "North Carolina" },
                  { value: "sc", label: "South Carolina" },
                  { value: "both", label: "Both / Not sure yet" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <input
                      type="radio"
                      name="state"
                      value={value}
                      checked={answers.state === value}
                      onChange={() => update("state", value)}
                      className="h-4 w-4 border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Is your household income at or below your area&apos;s typical limits?
              </h2>
              <p className="text-sm text-gray-600">
                Many programs have income caps (often based on area median income). If you&apos;re not sure, select &quot;Not sure&quot;—you can still explore programs and confirm with a lender.
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "unsure", label: "Not sure" },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <input
                      type="radio"
                      name="income"
                      value={value}
                      checked={answers.income === value}
                      onChange={() => update("income", value)}
                      className="h-4 w-4 border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canNext()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 4 ? "See results" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Here&apos;s what we found
          </h2>
          <p className="mt-3 text-gray-700">
            Based on your answers, you may be eligible for first-time homebuyer and down payment assistance programs. Eligibility varies by program and lender—browse programs below and confirm with a participating lender or housing counselor.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {stateSlug && (
              <Link
                href={`/${stateSlug}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse {stateSlug === "north-carolina" ? "North Carolina" : "South Carolina"} programs
              </Link>
            )}
            {answers.state === "both" && (
              <>
                <Link
                  href="/north-carolina"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  North Carolina
                </Link>
                <Link
                  href="/south-carolina"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  South Carolina
                </Link>
              </>
            )}
            <Link
              href="/programs"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View all programs
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setAnswers({ firstTime: "", primaryResidence: "", state: "", income: "" });
            }}
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
