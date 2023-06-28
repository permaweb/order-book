import { useParams } from 'react-router-dom';

import { AssetDetail } from 'global/AssetDetail';

export default function Asset() {
	const { id } = useParams();
	return id ? <AssetDetail assetId={id} /> : null;
}
