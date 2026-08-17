// components/HeroCard.tsx
import { HeroCardProps } from '@/interface'



const HeroCard = ({ label, description, icon: Icon } : HeroCardProps) => {
  return (
    <div className='bg-ivory p-6 sm:p-8 rounded-sm shadow-sm border border-brass/20 border-t-2 border-t-brass hover:shadow-md hover:border-brass/40 transition-all duration-300 flex flex-col h-full group'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='p-3 bg-parchment rounded-sm text-forest border border-brass/10 group-hover:border-brass/30 transition-colors'>
           <Icon size={24} />
        </div>
        <h3 className='text-xl text-forest font-bold' style={{ fontFamily: "'Playfair Display', serif" }}>
            {label}
        </h3>
      </div>
      <p className='text-charcoal/70 text-sm sm:text-base leading-relaxed' style={{ fontFamily: "'Lora', serif" }}>
        {description}
      </p>
    </div>
  )
}

export default HeroCard