import './Card.scss';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--padding-${padding}`,
    `card--shadow-${shadow}`,
    hover && 'card--hover',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || actions) && (
        <div className="card__header">
          <div className="card__header-content">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;
