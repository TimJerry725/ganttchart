/**
 * Resource usage view/histogram
 */

import React from 'react';
import type { ResourceUsage } from './resource-manager';

export interface ResourceViewProps {
  usage: Map<string, ResourceUsage[]>;
  resources: Array<{ id: string; name: string }>;
  startDate: Date;
  endDate: Date;
}

export const ResourceView: React.FC<ResourceViewProps> = ({
  usage,
  resources,
  startDate,
  endDate,
}) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
      <div className="space-y-4">
        {resources.map((resource) => {
          const resourceUsage = usage.get(resource.id) || [];
          const maxUsage = Math.max(...resourceUsage.map((u) => u.usage), 1);

          return (
            <div key={resource.id} className="border rounded p-3">
              <div className="font-medium mb-2">{resource.name}</div>
              <div className="flex gap-1 h-8">
                {resourceUsage.map((dayUsage, idx) => {
                  const percentage = (dayUsage.usage / maxUsage) * 100;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded ${
                        dayUsage.overloaded
                          ? 'bg-red-500'
                          : dayUsage.usage > 0
                            ? 'bg-blue-500'
                            : 'bg-gray-200'
                      }`}
                      style={{ height: `${percentage}%` }}
                      title={`${dayUsage.date.toLocaleDateString()}: ${dayUsage.usage}/${dayUsage.capacity}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
