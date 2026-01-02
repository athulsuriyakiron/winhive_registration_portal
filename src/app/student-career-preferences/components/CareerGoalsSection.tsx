'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CareerGoalsSectionProps {
  goals: {
    shortTerm: string;
    longTerm: string;
    skills: string[];
  };
  onGoalsChange: (field: 'shortTerm' | 'longTerm', value: string) => void;
  onSkillsChange: (skills: string[]) => void;
}

const CareerGoalsSection = ({ goals, onGoalsChange, onSkillsChange }: CareerGoalsSectionProps) => {
  const [skillInput, setSkillInput] = React.useState('');

  const suggestedSkills = [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS',
    'Data Analysis', 'Machine Learning', 'Communication', 'Leadership',
    'Project Management', 'Problem Solving', 'Team Collaboration'
  ];

  const handleAddSkill = (skill: string) => {
    if (skill && !goals.skills.includes(skill) && goals.skills.length < 10) {
      onSkillsChange([...goals.skills, skill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(goals.skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="RocketLaunchIcon" size={24} variant="solid" className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">Short-term Career Goal</h3>
        </div>
        <p className="text-sm text-text-secondary mb-3">What do you want to achieve in the next 1-2 years?</p>
        <textarea
          value={goals.shortTerm}
          onChange={(e) => onGoalsChange('shortTerm', e.target.value)}
          placeholder="E.g., Secure a software developer role at a product-based company and gain hands-on experience in full-stack development..."
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
          rows={4}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-text-secondary">Be specific about your immediate career objectives</p>
          <p className="text-xs text-text-secondary">{goals.shortTerm.length}/500</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrophyIcon" size={24} variant="solid" className="text-accent" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">Long-term Career Vision</h3>
        </div>
        <p className="text-sm text-text-secondary mb-3">Where do you see yourself in 5-10 years?</p>
        <textarea
          value={goals.longTerm}
          onChange={(e) => onGoalsChange('longTerm', e.target.value)}
          placeholder="E.g., Become a technical lead managing a team of developers, contributing to innovative projects that impact millions of users..."
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
          rows={4}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-text-secondary">Describe your ultimate career aspirations</p>
          <p className="text-xs text-text-secondary">{goals.longTerm.length}/500</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AcademicCapIcon" size={24} variant="solid" className="text-success" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">Key Skills to Develop</h3>
        </div>
        <p className="text-sm text-text-secondary mb-4">Add up to 10 skills you want to master (technical & soft skills)</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(skillInput);
              }
            }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            disabled={goals.skills.length >= 10}
          />
          <button
            onClick={() => handleAddSkill(skillInput)}
            disabled={!skillInput || goals.skills.length >= 10}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="PlusIcon" size={20} variant="solid" />
          </button>
        </div>

        {goals.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-text-secondary mb-2">Selected Skills ({goals.skills.length}/10):</p>
            <div className="flex flex-wrap gap-2">
              {goals.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <Icon name="XMarkIcon" size={14} variant="solid" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-text-secondary mb-2">Suggested Skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills
              .filter(skill => !goals.skills.includes(skill))
              .slice(0, 8)
              .map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSkill(skill)}
                  disabled={goals.skills.length >= 10}
                  className="px-3 py-1.5 bg-muted text-text-primary rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {skill}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalsSection;