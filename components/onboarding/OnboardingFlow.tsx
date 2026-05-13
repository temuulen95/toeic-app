"use client";

import { useState } from "react";
import { UserProfile, OnboardingStep } from "@/lib/types";
import Step1Nickname from "./Step1Nickname";
import Step2Motivation from "./Step2Motivation";
import Step3CurrentScore from "./Step3CurrentScore";
import Step4TargetScore from "./Step4TargetScore";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [partial, setPartial] = useState<Partial<UserProfile>>({});

  const dots = [1, 2, 3, 4] as OnboardingStep[];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-yellow-100 p-8 max-w-sm w-full">
      <div className="flex justify-center gap-2 mb-8">
        {dots.map((d) => (
          <div
            key={d}
            className={`h-2 rounded-full transition-all duration-300 ${
              d === step ? "w-6 bg-yellow-400" : d < step ? "w-2 bg-yellow-300" : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Step1Nickname
          onNext={(nickname) => {
            setPartial((p) => ({ ...p, nickname }));
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2Motivation
          onNext={(motivation, careerSubType) => {
            setPartial((p) => ({ ...p, motivation, careerSubType }));
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3CurrentScore
          onNext={(currentScore) => {
            setPartial((p) => ({ ...p, currentScore }));
            setStep(4);
          }}
        />
      )}
      {step === 4 && (
        <Step4TargetScore
          currentScore={partial.currentScore ?? 0}
          onNext={(targetScore) => {
            const profile: UserProfile = {
              nickname: partial.nickname!,
              motivation: partial.motivation!,
              careerSubType: partial.careerSubType,
              currentScore: partial.currentScore!,
              targetScore,
            };
            onComplete(profile);
          }}
        />
      )}
    </div>
  );
}
