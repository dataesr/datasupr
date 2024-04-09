import PrctIpccPublicationsByCountry from './charts/PrctIpccPublicationsByCountry';
import PrctIpccPublicationsByCountryByWg1 from './charts/PrctIpccPublicationsByCountryByWg1';
import PrctIpccPublicationsByCountryByWg2 from './charts/PrctIpccPublicationsByCountryByWg2';
import PrctIpccPublicationsByCountryByWg2cross from './charts/PrctIpccPublicationsByCountryByWg2cross';
import PrctIpccPublicationsByCountryByWg3 from './charts/PrctIpccPublicationsByCountryByWg3';

import './gallery.css'

export default function Welcome() {
  return (
    <div>
      <div>
        <PrctIpccPublicationsByCountry />
      </div>
      <div className="gallery">
        <PrctIpccPublicationsByCountryByWg1 />
        <PrctIpccPublicationsByCountryByWg2 />
        <PrctIpccPublicationsByCountryByWg2cross />
        <PrctIpccPublicationsByCountryByWg3 />
      </div>
    </div>
  );
}
