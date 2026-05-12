import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar forceSolid={true} />
      
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            {/* Left: Image Skeleton */}
            <div className="lg:w-[45%] flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-100 rounded-2xl"></div>
              <div className="hidden md:flex gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>

            {/* Right: Info Skeleton */}
            <div className="lg:w-[55%] flex flex-col">
              <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              
              <div className="w-full h-px bg-gray-100 my-6"></div>

              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              
              <div className="space-y-3 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 bg-gray-50 rounded-xl border-2 border-gray-100"></div>
                ))}
              </div>

              <div className="h-12 bg-gray-100 rounded-lg w-full mb-8"></div>

              <div className="flex gap-4">
                <div className="w-32 h-12 bg-gray-100 rounded-lg"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}