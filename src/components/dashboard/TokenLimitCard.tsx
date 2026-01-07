interface TokenModel {
  name: string;
  used: number;
  total: number;
}

interface TokenLimitCardProps {
  models: TokenModel[];
}

const TokenLimitCard = ({ models }: TokenLimitCardProps) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString("th-TH") + " Token";
  };

  const formatRemaining = (num: number): string => {
    return num.toLocaleString("th-TH") + " left";
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">จำนวนโทเค็นคงเหลือตามโมเดล</p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {models.map((model, index) => (
          <div key={index} className="flex-shrink-0 bg-muted/30 rounded-lg p-4 min-w-[160px] border border-border/50">
            <p className="text-sm font-medium text-foreground mb-3">{model.name}</p>
            <p className="text-sm font-semibold text-primary">{formatRemaining(model.total - model.used)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatNumber(model.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenLimitCard;
