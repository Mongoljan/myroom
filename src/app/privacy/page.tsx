// app/privacy/page.tsx
'use client';
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

// Privacy policy sections data
const privacySections: Section[] = [
  {
    id: '1',
    title: 'Ерөнхий зүйл',
    description: `"MyRoom" нь захиалагч болон харилцагч газар /цаашид хамтад нь "Хэрэглэгч" гэх/-ын мэдээллийн аюулгүй байдлыг хангах ажиллах үүрэгтэй ба энэ хүрээнд хэрэглэгчдийн хувийн мэдээллийг цуглуулах, ашиглах, дамжуулах, хадгалах үед дагаж мөрдөх баримт бичиг нь энэхүү Нууцлалын бодлого болно.`,
    clauses: [
      {
        id: '1.1',
        content: 'Хэрэглэгч нь "MyRoom"-ийг ашиглахдаа "Үйлчилгээний нөхцөл" болон "Нууцлалын бодлого"-той бүрэн танилцах үүрэгтэй бөгөөд "Би хүлээн зөвшөөрч байна" гэсэн товчийг идэвхжүүлснээр үйлчилгээ үзүүлэх энэхүү гэрээ, бодлогын хэрэгжилтийг хангахад шаардлагатай хэрэглэгчийн хувийн мэдээллийг цуглуулж, боловсруулах, ашиглах, дамжуулах эрхийг бидэнд олгосон гэж үзнэ.'
      },
      {
        id: '1.2',
        content: 'Хэрэглэгч нь Нууцлалын бодлогыг хүлээн зөвшөөрч, "MyRoom"-ийг ашигласан цагаас эхлэн энэхүү Нууцлалын бодлого хүчин төгөлдөр үйлчилнэ.'
      }
    ]
  },
  {
    id: '2',
    title: 'Мэдээлэл цуглуулах, боловсруулах',
    clauses: [
      {
        id: '2.1',
        content: 'Хэрэглэгч нь "MyRoom"-ийг хэвийн, тасралтгүй үйл ажиллагааг хангах, үйлчилгээг бүрэн ашиглах боломжийг бүрдүүлэх хүрээнд хэрэглэгчийн дараах мэдээллийг цуглуулж, боловсруулж, ашиглах боломжтой байна. Үүнд:'
      },
      {
        id: '2.1.1',
        content: 'Захиалагчийн овог, нэр, төрсөн огноо, хүйс, иргэншил, и-баримтын код, захиалгын мэдээлэл, захиалгын үйл явц, захиалгын баталгаажилт, холбоо барих утасны дугаар, и-мэйл хаяг, захиалгын түүх, гүйлгээний түүх, төлбөрийн мэдээлэл зэрэг мэдээллүүд;'
      },
      {
        id: '2.1.2',
        content: 'Харилцагч газрын хувьд бүртгүүлж байгаа хүний овог, нэр, албан тушаал, и-мэйл хаяг, утасны дугаар зэрэг хувийн мэдээллээс гадна тухайн газрын байгууллагын регистр, компанийн нэр, буудлын нэр, үйл ажиллагааны төрөл, хаяг, өрөөний мэдээлэл, үнэ, үнийн бодлого, дотоод журам, үйлчилгээ, захиалгын үйл явц, захиалгын баталгаажилт, захиалгын түүх, захиалагчийн мэдээлэл, статистик тайлан, төлбөрийн мэдээлэл болон бусад дэлгэрэнгүй мэдээлэл гэх мэт;'
      },
      {
        id: '2.1.3',
        content: '"MyRoom" дээр хийгдсэн төлбөрийн гүйлгээтэй холбоотой хүлээн авагчийн нэр, мөнгөн дүн, огноо, баталгаажилттай хамаарах мэдээлэл;'
      },
      {
        id: '2.1.4',
        content: 'Хэрэглэгчийн санал, хүсэлт, гомдол болон түүнийг шйидвэрлэх явц, үр дүнгийн талаар мэдээлэл;'
      },
      {
        id: '2.2',
        content: 'Нэг удаагийн нэвтрэлтээр буюу Facebook эсвэл Google-ээр нэвтрэх сонголтыг хийсэн тохиолдолд таны бүртгэлээс шаардлагатай мэдээллийг импортлон, хэрэглэгчийн мэдээллийн нэг хэсэг болно.'
      },
      {
        id: '2.3',
        content: '"MyRoom"-ийн үйлчилгээг энгийн, хялбар болгон хөгжүүлж, сайжруулах болон хууль бус хандалтаас урьдчилан сэргийлэх хүрээнд хэрэглэгчийн дараах мэдээллийг автоматаар цуглуулах ба үүнд:'
      },
      {
        id: '2.3.1',
        content: 'Хэрэглэгчийн "MyRoom" дээр хийсэн үйлдэл болон үйлдлийн системийн мэдээлэл;'
      },
      {
        id: '2.3.2',
        content: '"MyRoom" дээр хайсан, үзсэн, ашигласантай холбогдох бүхий л үйлдэл болон мэдээлэл;'
      },
      {
        id: '2.3.3',
        content: 'IP хаягийн мэдээлэл, веб хөтөч, ашиглаж буй үйлдлийн систем, газар зүйн байршлын мэдээллүүд;'
      }
    ]
  },
  {
    id: '3',
    title: 'Мэдээлэл ашиглах, дамжуулах',
    clauses: [
      {
        id: '3.1',
        content: '"MyRoom" нь 2.1-т тусгагдсан мэдээллүүдийг цуглуулж, нэгтгэн боловсруулсны үндсэн дээр "MyRoom"-ийн хэвийн үйл ажиллагаа, үйлчилгээг ханган ажиллах, харилцаа холбоо тогтоох, мөн үйлчилгээнийхээ цаашдын хөгжүүлэлт, сайжруулалтын хүрээнд дараах нөхцөлөөр ашиглана. Үүнд:'
      },
      {
        id: '3.1.1',
        content: 'Захиалгын мэдээлэл болон үйл явцтай холбоотой тодруулах зүйл гарсан тохиолдолд;'
      },
      {
        id: '3.1.2',
        content: 'Хэрэглэгчийн гар утас болон и-мэйл хаяг руу мэдэгдэл, мэдээлэл хүргүүлэх;'
      },
      {
        id: '3.1.3',
        content: 'Харилцагч газрын байршил, хаягийн мэдээллийг захиалгачдад ойр байршлаар нь санал болгох тохиолдолд ашиглах;'
      },
      {
        id: '3.1.4',
        content: 'Хэрэглэгчийн санал, хүсэлт, гомдлыг хянан, шийдвэрлэх явцад;'
      },
      {
        id: '3.1.5',
        content: 'Хэрэглэгчид "MyRoom" болон Харилцагч газрын талаарх шинэ үйлчилгээ, хямдрал, хөнгөлөлт, мэдээ мэдээлэл, нийтлэлийн талаар хүргэх зориулалтаар;'
      },
      {
        id: '3.2',
        content: 'Хэрэглэгчийн 2.1-т дурдсан бүх мэдээллийг бид хэрэглэгчийн зөвшөөрөлтэйгээр буюу "Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг зөвшөөрч байна" гэж сонгосны дагуу авч ашиглаж байгаа болно.'
      },
      {
        id: '3.3',
        content: 'Харилцагч газар нь "MyRoom" дээр бүртгэл үүсгэн, 2.1.2-т заасан мэдээллийг өгөхийг зөвшөөрснөөр маркетингийн хүрээнд дараах боломжууд үүсэх ба үүнд:'
      },
      {
        id: '3.3.1',
        content: 'Тухайн харилцагч газрын онцлогтой нийцсэн контент, үйлчилгээ, сурталчилгааг үзүүлэх, хамтран ажиллах;'
      },
      {
        id: '3.3.2',
        content: 'Арга хэмжээ, үйл ажиллагаа зохион байгуулах, оролцох, санал асуулга авах, үр дүнг гаргах, түгээх ажил дээр хамтран ажиллах;'
      },
      {
        id: '3.4',
        content: 'Хэрэглэгч нь "MyRoom"-ийн үйлчилгээ, үйл ажиллагааг сайжруулах хүрээнд алдаатай эсвэл ашиглагдахгүй байгаа үйлчилгээг мэдээллэж, сайжруулах, үйлдэл ихтэй үйлчилгээг хялбар болгох тал дээр санал, хүсэлтээ чөлөөтэй, нээлттэй илэрхийлэх, санаачлах, болон ашиглалтын талаар дүн шинжилгээ хийж, дотоод тайлан гаргах зэрэг дээр хамтран ажиллахад нээлттэй боломжийг олгоно.'
      },
      {
        id: '3.5',
        content: '"MyRoom" нь үйлчилгээг сайжруулах зорилгоор лавлахтай холбогдох үеийн дуудлагын аудио бичлэгийг хуульд заасан хугацааагаар хадгална.'
      },
      {
        id: '3.6',
        content: '"MyRoom" нь захиалгын үед харилцагч газарт захиалагчийн зөвхөн овог, нэр, захиалгын мэдээлэл болон холбоо барих мэдээллийг дамжуулах бөгөөд бусад хувийн мэдээллийг харилцагч газарт захиалагчийн зөвшөөрөлгүйгээр дамжуулахгүй болно.'
      },
      {
        id: '3.7',
        content: 'Монгол улсын хуулийн дагуу төрийн эрх бүхий байгууллагын шаардлагаар хэрэглэгчийн хувийн мэдээллийг дамжуулах, олон нийтэд ил болгох боломжтой ба бусад ямар ч нөхцөлд дамжуулж, гадагш задруулахгүй болно.'
      }
    ]
  },
  {
    id: '4',
    title: 'Бусад',
    clauses: [
      {
        id: '4.1',
        content: 'Захиалагч нь өөрийн бүртгэлээрээ нэвтрэн орж, хувийн мэдээллээ засах болон устгах боломжтой бол харин Харилцагч газрын хувьд захирал болон менежер албан тушаалын эрх бүхий хэрэглэгчээс бусад хэрэглэгчийн эрх нь хязгаарлагдмал байна.'
      },
      {
        id: '4.2',
        content: 'Хэрэглэгчийн хүсэлтээр тухайн хэрэглэгчийн мэдээлэлд өөрчлөлт оруулах эсвэл засах арга хэмжээг зохион байгуулж болно.'
      },
      {
        id: '4.3',
        content: 'Хэрэглэгч нь өөрийн нэвтрэх нэр, нууц үгийн аюулгүй байдлыг хангах үүрэгтэй.'
      },
      {
        id: '4.4',
        content: 'Хэрэглэгч нь өөрийн бүртгэлтэй хаягаа өөрийн хүсэлтээр устгасан эсвэл Үйлчилгээний нөхцөлийг зөрчсөний улмаас таны бүртгэлийг цуцалсан тохиолдолд цаашид "MyRoom" дээр хэрэглэгчийн мэдээллийг дахин цуглуулах, боловсруулах, ашиглах боломжгүй болно.'
      },
      {
        id: '4.5',
        content: 'Хэрэв таны холбоо барих мэдээлэл (и-мэйл хаяг эсвэл гар утасны дугаар)-ийг өөр хэн нэгэн ашиглаж, бүртгэл үүсгэсэн нөхцөлд "MyRoom"-ийн Хэрэглэгч үйлчилгээний төв рүү холбогдож, шийдвэрлүүлэх боломжтой.'
      },
      {
        id: '4.6',
        content: '"MyRoom"-ийн үйлчилгээнд ямар нэг өөрчлөлт гарсантай холбоотой энэхүү Нууцлалын бодлого шинэчлэгдэж болох ба шинэчилсэн тохиолдолд "MyRoom" нь хэрэглэгчдэд тухай бүрт мэдэгдэх үрргийг хүлээнэ.'
      }
    ]
  }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>('1');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup Intersection Observer to track visible sections
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let nextSectionId: string | null = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio && entry.isIntersecting) {
            maxRatio = entry.intersectionRatio;
            nextSectionId = entry.target.id.replace('section-', '');
          }
        });

        if (nextSectionId) {
          setActiveSection(nextSectionId);
        }
      },
      {
        threshold: [0, 0.3, 0.5, 0.7, 1.0],
        rootMargin: '-100px 0px -50% 0px',
      }
    );

    privacySections.forEach((section) => {
      const element = document.getElementById(`section-${section.id}`);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                Нууцлалын бодлого
              </h2>
              <nav className="space-y-2">
                {privacySections.map((section: Section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(String(section.id))}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-between group ${
                      activeSection === String(section.id)
                        ? 'bg-slate-50 text-slate-900 font-medium border-l-4 border-slate-900 pl-2'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span className="text-sm">{section.title}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        activeSection === String(section.id)
                          ? 'text-slate-900'
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
              Нууцлалын бодлого
            </h1>
            <div className="mt-3.5 mb-6 flex-1 flex justify-end">
              <p className="text-gray-500 text-sm">Шинэчлэгдсэн: 2025.01.01</p>
            </div>
            <div className="">
              {privacySections.map((section: Section) => (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  className="bg-white p-6 shadow-sm rounded-lg mb-4 last:mb-0 scroll-mt-24"
                >
                  <h3 className="text-md font-bold text-gray-900 mb-4 pb-2">
                    {section.title}
                  </h3>

                  {section.description && (
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                        {section.description}
                      </p>
                    </div>
                  )}

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
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
