"use client";

export default function Interactive() {
  return (
    <div className="bg-stone-50 text-stone-900 font-sans w-full">
      {/* Utility Section (Split Layout) */}
      <section id="utility-split" className="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center border-b border-stone-200">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">유틸리티.</h2>
            <p className="text-xl text-stone-500 mb-12 break-keep">
              집안일을 매끄럽게 자동화합니다.
            </p>
            <div className="space-y-6 text-2xl md:text-4xl font-medium tracking-tight text-stone-400">
              <p className="hover:text-stone-900 transition-colors cursor-pointer">사람에게 다가가기</p>
              <p className="hover:text-stone-900 transition-colors cursor-pointer">설거지 정리하기</p>
              <p className="hover:text-stone-900 transition-colors cursor-pointer">욕실 청소하기</p>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-3xl p-8 h-[500px] flex items-center justify-center relative overflow-hidden group shadow-md">
            <img src="/utility.png" alt="HUMANICS Utility" className="w-full h-full object-contain rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>

      {/* Design Section (Bento Grid) */}
      <section id="design" className="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center border-b border-stone-200">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-7xl font-bold mb-16">디자인.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 큰 이미지 (2x2) */}
            <div className="md:col-span-2 md:row-span-2 relative min-h-[400px] md:min-h-full rounded-3xl overflow-hidden group border border-stone-200 shadow-sm">
               <img src="/design/gentle.png" alt="Gentle" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">온화함</h3>
                 <p className="text-stone-200 md:text-lg max-w-sm">사람과 환경에 완벽하게 어우러지는 부드럽고 안전한 디자인입니다.</p>
               </div>
            </div>
            
            {/* 작은 이미지들 (1x1) */}
            <div className="relative h-[250px] rounded-3xl overflow-hidden group border border-stone-200 shadow-sm">
               <img src="/design/knit_suit.png" alt="Knit Suit" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                 <h3 className="text-xl font-bold text-white">니트 슈트</h3>
               </div>
            </div>
            
            <div className="relative h-[250px] rounded-3xl overflow-hidden group border border-stone-200 shadow-sm">
               <img src="/design/tendon.png" alt="Tendon-Driven" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                 <h3 className="text-xl font-bold text-white">텐던 구동</h3>
               </div>
            </div>

            <div className="relative h-[250px] rounded-3xl overflow-hidden group border border-stone-200 shadow-sm">
               <img src="/design/soft_body.png" alt="Soft Body" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                 <h3 className="text-xl font-bold text-white">부드러운 바디</h3>
               </div>
            </div>

            <div className="relative h-[250px] rounded-3xl overflow-hidden group border border-stone-200 shadow-sm">
               <img src="/design/emotive.jpg" alt="Emotive Ear Ring" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
                 <h3 className="text-xl font-bold text-white">감정 표현 이어링</h3>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companion & Intelligence Section */}
      <section id="intelligence" className="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center border-b border-stone-200">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold">동반자.</h2>
            <div className="p-8 border border-stone-200 rounded-3xl bg-white shadow-sm">
              <h3 className="text-2xl mb-4 font-semibold">음성 인터페이스</h3>
              <p className="text-stone-600 text-lg leading-relaxed break-keep">
                고급 자연어 처리(NLP)를 통한 자연스러운 대화. 친구에게 말하듯 HUMANICS에게 이야기하세요.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold">인공지능.</h2>
            <div className="p-8 border border-stone-200 rounded-3xl bg-white shadow-sm">
              <h3 className="text-2xl mb-4 font-semibold">레드우드 AI</h3>
              <p className="text-stone-600 text-lg leading-relaxed break-keep">
                체화된 지능과 공간 이해를 위해 설계된 최첨단 모델로 구동됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
