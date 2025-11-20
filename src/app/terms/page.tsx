// app/terms/page.tsx
'use client';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Clause {
  id: string;
  content: string;
}

interface Section {
  id: number | string;
  title: string;
  description?: string;
  clauses?: Clause[];
}

// Skeleton component for the sidebar navigation
const SidebarSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 animate-pulse"></div>
    <nav className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      ))}
    </nav>
  </div>
);

// Skeleton component for the main content
const ContentSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
    {[...Array(5)].map((_, sectionIndex) => (
      <section key={sectionIndex} className="mb-12 last:mb-0">
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4 animate-pulse"></div>
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, clauseIndex) => (
          <div key={clauseIndex} className="mb-4 last:mb-0">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200">
              <div className="flex">
                <div className="h-4 bg-gray-200 rounded w-8 mr-2 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    ))}
  </div>
);

// Header skeleton
const HeaderSkeleton = () => (
  <header className="bg-white py-8">
    <div className="container mx-auto px-4 flex items-center justify-between">
      <div className="flex-1" aria-hidden="true" />
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      <div className="flex-1 flex justify-end">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  </header>
);

export default function TermsPage() {
  const { t, tAny, mounted } = useHydratedTranslation();
  const [activeSection, setActiveSection] = useState<string>('1');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get sections array from translation file
  const sections = tAny<Section[]>('terms.sections', { returnObjects: true });

  // Setup Intersection Observer to track visible sections
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible
        let maxRatio = 0;
        let nextSectionId: string | null = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio && entry.isIntersecting) {
            maxRatio = entry.intersectionRatio;
            nextSectionId = entry.target.id.replace('section-', '');
          }
        });

        // Update active section based on most visible section
        if (nextSectionId) {
          setActiveSection(nextSectionId);
        }
      },
      {
        // Trigger when 30% of section is visible
        threshold: [0, 0.3, 0.5, 0.7, 1.0],
        // Add margin to trigger earlier
        rootMargin: '-100px 0px -50% 0px',
      }
    );

    // Observe all section elements
    if (Array.isArray(sections)) {
      sections.forEach((section) => {
        const element = document.getElementById(`section-${section.id}`);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // Handle manual scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show skeleton while translations are loading
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderSkeleton />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <SidebarSkeleton />
            </aside>
            <main className="lg:col-span-3">
              <ContentSkeleton />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                {t('terms.title', 'Үйлчилгээний нөхцөл')}
              </h2>
              <nav className="space-y-2">
                {Array.isArray(sections) &&
                  sections.map((section: Section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(String(section.id))}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-between group ${
                        activeSection === String(section.id)
                          ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 pl-2'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <span className="text-sm">{section.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          activeSection === String(section.id)
                            ? 'text-blue-600'
                            : 'text-gray-400 group-hover:translate-x-1'
                        }`}
                      />
                    </button>
                  ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <h1 className="text-2xl font-medium text-center text-gray-900 flex-1">
              {t('terms.title')}
            </h1>
            <div className="mt-3.5 mb-6 flex-1 flex justify-end">
              <p className="text-gray-500 text-sm">{t('terms.date')}</p>
            </div>
            <div className="">
              {Array.isArray(sections) ? (
                sections.map((section: Section) => (
                  <section
                    key={section.id}
                    id={`section-${section.id}`}
                    className=" bg-white p-6 shadow-sm rounded-lg mb-4 last:mb-0 scroll-mt-24"
                  >
                    {/* Section Title */}
                    <h3 className="text-md font-bold text-gray-900 mb-4 pb-2 ">
                      {section.title}
                    </h3>

                    {/* Section Description */}
                    {section.description && (
                      <div className="prose max-w-none mb-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                          {section.description}
                        </p>
                      </div>
                    )}

                    {/* Clauses */}
                    {section.clauses &&
                      Array.isArray(section.clauses) &&
                      section.clauses.map((clause: Clause) => (
                        <div key={clause.id} className="mb-4 last:mb-0">
                          <div className="pl-4">
                            <p className="text-gray-700 leading-relaxed text-sm">
                              <span className="font-semibold text-gray-900 mr-2">
                                {clause.id}
                              </span>
                              {clause.content}
                            </p>
                          </div>
                        </div>
                      ))}
                  </section>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {t('terms.loadError', 'Terms sections could not be loaded.')}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}