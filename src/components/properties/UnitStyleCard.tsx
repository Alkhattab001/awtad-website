import { useLanguage } from '@/context/LanguageContext';
import { BedDouble, Bath, Maximize, Building2, Check, X } from 'lucide-react';
import type { Unit } from '@/types';

interface Props {
  unit: Unit;
  onInterest: (unit: Unit) => void;
}

const availColors: Record<string, string> = {
  available: 'bg-green-50 text-green-700 border-green-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  sold: 'bg-muted text-muted-foreground border-border',
};

const availLabels: Record<string, { en: string; ar: string }> = {
  available: { en: 'Available', ar: 'متاح' },
  reserved: { en: 'Reserved', ar: 'محجوز' },
  sold: { en: 'Sold', ar: 'مباع' },
};

const UnitStyleCard = ({ unit, onInterest }: Props) => {
  const { t, language } = useLanguage();
  const title = language === 'en' ? unit.title_en : unit.title_ar;
  const desc = language === 'en' ? unit.description_en : unit.description_ar;
  const avail = availLabels[unit.availability_status];

  const specs = [
    { icon: <Maximize size={16} />, label: `${unit.area_sqm} ${t('sqm', 'م²')}` },
    { icon: <BedDouble size={16} />, label: `${unit.bedrooms} ${t('Bed', 'غرف')}` },
    { icon: <Bath size={16} />, label: `${unit.bathrooms} ${t('Bath', 'حمام')}` },
    { icon: <Building2 size={16} />, label: `${t('Floor', 'الطابق')} ${unit.floor}` },
  ];

  return (
    <div className="grid gap-0 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2">
      {/* Image */}
      <div className="relative bg-muted">
        <img
          src={unit.brochure_image}
          alt={title}
          className="h-full min-h-[300px] w-full object-cover md:min-h-[400px]"
        />
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-accent/90 px-3 py-1 font-body text-xs font-semibold text-accent-foreground backdrop-blur">
            {unit.style_code}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 md:p-8">
        <div>
          {/* Availability badge */}
          <div className="mb-4">
            <span className={`inline-block rounded-full border px-3 py-1 font-body text-xs font-semibold ${availColors[unit.availability_status]}`}>
              {t(avail.en, avail.ar)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{desc}</p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2.5">
                <span className="text-primary">{spec.icon}</span>
                <span className="font-body text-sm font-medium text-foreground">{spec.label}</span>
              </div>
            ))}
          </div>

          {/* Additional specs */}
          <div className="grid grid-cols-2 gap-2 mb-6 font-body text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{t('Balconies', 'شرفات')}:</span>
              <span className="font-medium text-foreground">{unit.balconies}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{t('Living Rooms', 'صالات')}:</span>
              <span className="font-medium text-foreground">{unit.living_rooms}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{t("Maid's Room", 'غرفة خادمة')}:</span>
              {unit.maid_room ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{t('Laundry', 'غسيل')}:</span>
              {unit.laundry_room ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-muted-foreground" />}
            </div>
          </div>

          {unit.price_starting_from && (
            <p className="font-body text-sm text-muted-foreground mb-6">
              {t('Starting from', 'يبدأ من')}{' '}
              <span className="text-lg font-semibold text-foreground">
                {unit.price_starting_from.toLocaleString()} {t('OMR', 'ر.ع.')}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={() => onInterest(unit)}
          disabled={unit.availability_status === 'sold'}
          className="w-full rounded-md bg-gradient-gold px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("I'm interested in this unit", 'أنا مهتم بهذه الوحدة')}
        </button>
      </div>
    </div>
  );
};

export default UnitStyleCard;
