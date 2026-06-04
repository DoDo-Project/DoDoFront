export function PetDetailError({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-red-100 bg-white shadow-sm">
      <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.24em] text-red-500">ERROR</p>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-950">반려동물 상세 정보를 불러오지 못했습니다</h1>
      </div>
      <div className="px-6 py-6 sm:px-8">
        <p className="text-sm leading-7 text-neutral-600 sm:text-base">{message}</p>
      </div>
    </div>
  );
}
