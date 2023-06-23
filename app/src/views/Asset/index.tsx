import { useParams } from 'react-router-dom';

import { AssetDetail } from 'global/AssetDetail';

// TODO: valid id check return invalid
export default function Asset() {
	const { id } = useParams();
	return id ? <AssetDetail assetId={id} /> : null;
}
