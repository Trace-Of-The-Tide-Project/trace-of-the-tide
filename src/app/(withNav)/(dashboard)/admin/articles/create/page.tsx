"use client";

import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { CreatePageFilters } from "@/components/dashboard/admin/articles/articles-create/CreatePageFilters";
import { TemplateCard } from "@/components/dashboard/admin/articles/articles-create/TemplateCard";
import {
  createTemplateFilters,
  createTemplates,
} from "@/components/dashboard/admin/articles/data/create-template-data";

export default function CreateArticlePage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredTemplates = useMemo(() => {
    if (selectedFilter === "all") return createTemplates;
    return createTemplates.filter((t) => t.category === selectedFilter);
  }, [selectedFilter]);

  return (
    <div>
      <DashboardHeader
        compactPadding
        title="Create New"
        subtitle="Choose a template to start building your content. Each template is optimized for specific storytelling formats."
        actions={
          <CreatePageFilters
            options={createTemplateFilters}
            selectedId={selectedFilter}
            onSelect={setSelectedFilter}
          />
        }
      />
      <div className="px-6 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.number}
              number={template.number}
              title={template.title}
              description={template.description}
              icon={template.icon}
              href={template.href}
              onClick={template.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
