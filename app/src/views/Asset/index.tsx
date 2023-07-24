import React from 'react';
import { useParams } from 'react-router-dom';

import { AssetDetail } from './AssetDetail';

export default function Asset() {
	const { id } = useParams();

	const [idParam, setIdParam] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (id) setIdParam(id);
	}, [id]);

	return idParam ? <AssetDetail assetId={idParam} /> : null;
}
