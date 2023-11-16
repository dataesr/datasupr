import PropTypes from 'prop-types';
import { Badge, Container, Icon, Row, Title } from '@dataesr/react-dsfr';

export default function TitleComponent({ as, betaBadge, icon, look, subTitle, title }) {
  const spaces = ((subTitle) ? ('fr-mb-0') : ('fr-mb-3w'));

  return (
    <div>
      <div>
        <Title as={as} look={look} className={spaces}>
          {
            (icon) ? (
              <Icon name={icon} />
            ) : null
          }
          {title}
          {
            (betaBadge) && <Badge text="Version [bêta]" className="fr-ml-1w" colorFamily="green-menthe" />
          }
        </Title>
      </div>
      {
        (subTitle) ? (
          <div className="fr-mb-3w fr-card__detail">{subTitle}</div>
        ) : null
      }
    </div>
  );
}

TitleComponent.propTypes = {
  as: PropTypes.string,
  betaBadge: PropTypes.bool,
  icon: PropTypes.string,
  look: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

TitleComponent.defaultProps = {
  as: 'h3',
  betaBadge: false,
  icon: '',
  look: 'h3',
  subTitle: '',
};
