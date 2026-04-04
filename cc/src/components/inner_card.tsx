export function InnerCard({ children, className="" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 ${className}`}>
            {children}
        </div>
    )
}