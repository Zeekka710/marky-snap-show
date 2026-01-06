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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' Token';
    }
    return num.toLocaleString('th-TH') + ' Token';
  };

  const formatRemaining = (num: number): string => {
    return num.toLocaleString('th-TH') + ' left';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">Token Limit per model</p>
      <div className="flex gap-4 overflow-x-auto">
        {models.map((model, index) => (
          <div 
            key={index}
            className="flex-shrink-0 bg-muted/30 rounded-lg p-4 min-w-[140px] border border-border/50"
          >
            <p className="text-sm font-medium text-foreground mb-2">{model.name}</p>
            <p className="text-xs text-muted-foreground">{formatRemaining(model.total - model.used)}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(model.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenLimitCard;
