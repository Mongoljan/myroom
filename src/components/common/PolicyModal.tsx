'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

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

// Privacy policy content (mirrors /app/privacy/page.tsx)
const privacySections: Section[] = [
  {
    id: '1',
    title: 'Ерөнхий зүйл',
    description: '"MyRoom" нь захиалагч болон харилцагч газар /цаашид хамтад нь "Хэрэглэгч" гэх/-ын мэдээллийн аюулгүй байдлыг хангах ажиллах үүрэгтэй ба энэ хүрээнд хэрэглэгчдийн хувийн мэдээллийг цуглуулах, ашиглах, дамжуулах, хадгалах үед дагаж мөрдөх баримт бичиг нь энэхүү Нууцлалын бодлого болно.',
    clauses: [
      { id: '1.1', content: 'Хэрэглэгч нь "MyRoom"-ийг ашиглахдаа "Үйлчилгээний нөхцөл" болон "Нууцлалын бодлого"-той бүрэн танилцах үүрэгтэй бөгөөд "Би хүлээн зөвшөөрч байна" гэсэн товчийг идэвхжүүлснээр үйлчилгээ үзүүлэх энэхүү гэрээ, бодлогын хэрэгжилтийг хангахад шаардлагатай хэрэглэгчийн хувийн мэдээллийг цуглуулж, боловсруулах, ашиглах, дамжуулах эрхийг бидэнд олгосон гэж үзнэ.' },
      { id: '1.2', content: 'Хэрэглэгч нь Нууцлалын бодлогыг хүлээн зөвшөөрч, "MyRoom"-ийг ашигласан цагаас эхлэн энэхүү Нууцлалын бодлого хүчин төгөлдөр үйлчилнэ.' },
    ],
  },
  {
    id: '2',
    title: 'Мэдээлэл цуглуулах, боловсруулах',
    clauses: [
      { id: '2.1', content: 'Хэрэглэгч нь "MyRoom"-ийг хэвийн, тасралтгүй үйл ажиллагааг хангах, үйлчилгээг бүрэн ашиглах боломжийг бүрдүүлэх хүрээнд хэрэглэгчийн дараах мэдээллийг цуглуулж, боловсруулж, ашиглах боломжтой байна. Үүнд:' },
      { id: '2.1.1', content: 'Захиалагчийн овог, нэр, төрсөн огноо, хүйс, иргэншил, и-баримтын код, захиалгын мэдээлэл, захиалгын үйл явц, захиалгын баталгаажилт, холбоо барих утасны дугаар, и-мэйл хаяг, захиалгын түүх, гүйлгээний түүх, төлбөрийн мэдээлэл зэрэг мэдээллүүд;' },
      { id: '2.1.2', content: 'Харилцагч газрын хувьд бүртгүүлж байгаа хүний овог, нэр, албан тушаал, и-мэйл хаяг, утасны дугаар зэрэг хувийн мэдээллээс гадна тухайн газрын байгууллагын регистр, компанийн нэр, буудлын нэр, үйл ажиллагааны төрөл, хаяг, өрөөний мэдээлэл, үнэ болон бусад дэлгэрэнгүй мэдээлэл гэх мэт;' },
      { id: '2.1.3', content: '"MyRoom" дээр хийгдсэн төлбөрийн гүйлгээтэй холбоотой хүлээн авагчийн нэр, мөнгөн дүн, огноо, баталгаажилттай хамаарах мэдээлэл;' },
      { id: '2.1.4', content: 'Хэрэглэгчийн санал, хүсэлт, гомдол болон түүнийг шийдвэрлэх явц, үр дүнгийн талаар мэдээлэл;' },
      { id: '2.2', content: 'Нэг удаагийн нэвтрэлтээр буюу Facebook эсвэл Google-ээр нэвтрэх сонголтыг хийсэн тохиолдолд таны бүртгэлээс шаардлагатай мэдээллийг импортлон, хэрэглэгчийн мэдээллийн нэг хэсэг болно.' },
      { id: '2.3', content: '"MyRoom"-ийн үйлчилгээг энгийн, хялбар болгон хөгжүүлж, сайжруулах болон хууль бус хандалтаас урьдчилан сэргийлэх хүрээнд хэрэглэгчийн дараах мэдээллийг автоматаар цуглуулах ба үүнд:' },
      { id: '2.3.1', content: 'Хэрэглэгчийн "MyRoom" дээр хийсэн үйлдэл болон үйлдлийн системийн мэдээлэл;' },
      { id: '2.3.2', content: '"MyRoom" дээр хайсан, үзсэн, ашигласантай холбогдох бүхий л үйлдэл болон мэдээлэл;' },
      { id: '2.3.3', content: 'IP хаягийн мэдээлэл, веб хөтөч, ашиглаж буй үйлдлийн систем, газар зүйн байршлын мэдээллүүд;' },
    ],
  },
  {
    id: '3',
    title: 'Мэдээлэл ашиглах, дамжуулах',
    clauses: [
      { id: '3.1', content: '"MyRoom" нь 2.1-т тусгагдсан мэдээллүүдийг цуглуулж, нэгтгэн боловсруулсны үндсэн дээр "MyRoom"-ийн хэвийн үйл ажиллагаа, үйлчилгээг ханган ажиллах, харилцаа холбоо тогтоох зорилгоор ашиглана. Үүнд:' },
      { id: '3.1.1', content: 'Захиалгын мэдээлэл болон үйл явцтай холбоотой тодруулах зүйл гарсан тохиолдолд;' },
      { id: '3.1.2', content: 'Хэрэглэгчийн гар утас болон и-мэйл хаяг руу мэдэгдэл, мэдээлэл хүргүүлэх;' },
      { id: '3.1.3', content: 'Харилцагч газрын байршил, хаягийн мэдээллийг захиалагчдад ойр байршлаар нь санал болгох тохиолдолд ашиглах;' },
      { id: '3.2', content: 'Хэрэглэгчийн 2.1-т дурдсан бүх мэдээллийг бид хэрэглэгчийн зөвшөөрөлтэйгээр буюу "Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг зөвшөөрч байна" гэж сонгосны дагуу авч ашиглаж байгаа болно.' },
      { id: '3.3', content: '"MyRoom" нь захиалгын үед харилцагч газарт захиалагчийн зөвхөн овог, нэр, захиалгын мэдээлэл болон холбоо барих мэдээллийг дамжуулах бөгөөд бусад хувийн мэдээллийг харилцагч газарт захиалагчийн зөвшөөрөлгүйгээр дамжуулахгүй болно.' },
      { id: '3.4', content: 'Монгол улсын хуулийн дагуу төрийн эрх бүхий байгууллагын шаардлагаар хэрэглэгчийн хувийн мэдээллийг дамжуулах, олон нийтэд ил болгох боломжтой ба бусад ямар ч нөхцөлд дамжуулж, гадагш задруулахгүй болно.' },
    ],
  },
  {
    id: '4',
    title: 'Бусад',
    clauses: [
      { id: '4.1', content: 'Захиалагч нь өөрийн бүртгэлээрээ нэвтрэн орж, хувийн мэдээллээ засах болон устгах боломжтой.' },
      { id: '4.2', content: 'Хэрэглэгч нь өөрийн нэвтрэх нэр, нууц үгийн аюулгүй байдлыг хангах үүрэгтэй.' },
      { id: '4.3', content: 'Хэрэглэгч нь өөрийн бүртгэлтэй хаягаа өөрийн хүсэлтээр устгасан эсвэл Үйлчилгээний нөхцөлийг зөрчсөний улмаас таны бүртгэлийг цуцалсан тохиолдолд цаашид "MyRoom" дээр хэрэглэгчийн мэдээллийг дахин цуглуулах, боловсруулах, ашиглах боломжгүй болно.' },
      { id: '4.4', content: '"MyRoom"-ийн үйлчилгээнд ямар нэг өөрчлөлт гарсантай холбоотой энэхүү Нууцлалын бодлого шинэчлэгдэж болох ба шинэчилсэн тохиолдолд "MyRoom" нь хэрэглэгчдэд тухай бүрт мэдэгдэх үүргийг хүлээнэ.' },
    ],
  },
];

export interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 'terms' = Үйлчилгээний нөхцөл | 'privacy' = Нууцлалын бодлого */
  type: 'terms' | 'privacy';
  /**
   * 'confirm' — shows Татгалзах + Зөвшөөрч байна buttons (signup flow)
   * 'read'    — shows only Хаах button (informational)
   */
  mode?: 'confirm' | 'read';
  /** Called when user clicks "Зөвшөөрч байна" in confirm mode */
  onAgree?: () => void;
}

function SectionContent({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">
            {section.id}. {section.title}
          </h3>
          {section.description && (
            <p className="mb-3">{section.description}</p>
          )}
          {section.clauses && section.clauses.length > 0 && (
            <ul className="space-y-2">
              {section.clauses.map((clause) => (
                <li key={clause.id} className="flex gap-2">
                  <span className="shrink-0 font-medium text-gray-500 dark:text-gray-400 min-w-[2.5rem]">
                    {clause.id}.
                  </span>
                  <span>{clause.content}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PolicyModal({
  isOpen,
  onClose,
  type,
  mode = 'read',
  onAgree,
}: PolicyModalProps) {
  const { tAny, mounted } = useHydratedTranslation();
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reset scroll on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => bodyRef.current?.scrollTo(0, 0), 50);
    }
  }, [isOpen, type]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTerms = type === 'terms';
  const title = isTerms ? 'Үйлчилгээний нөхцөл' : 'Нууцлалын бодлого';

  // Terms content comes from translation file; privacy content is inline
  const termsSections: Section[] = mounted
    ? (tAny<Section[]>('terms.sections', { returnObjects: true }) ?? [])
    : [];
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h2 className="flex-1 text-center text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Хаах"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          {sections.length === 0 ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <SectionContent sections={sections} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
          {mode === 'confirm' ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Татгалзах
              </button>
              <button
                onClick={() => {
                  onAgree?.();
                  onClose();
                }}
                className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Зөвшөөрч байна
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Хаах
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
