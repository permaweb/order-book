import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Carousel } from 'components/molecules/Carousel';
import * as S from './styles';
import { IProps } from './types';
import { language } from 'helpers/language';
import { CollectionCard } from 'global/CollectionCard'

export default function CollectionsCarousel(props: IProps) {
	
    function getCollections() {
        const navigate = useNavigate();
        
        let collections = [
            {
                id: "asdf",
                banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
                thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
                title: "Title 1",
                description: "Desc 1",
                stamps: {
                    total: 5,
                    vouched: 2,
                },
                author: {
                    address: "asdlkvn....asldkvna",
                    handle: "jajablinky"
                }
            },
            {
                id: "asdf1",
                banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
                thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
                title: "Title 1",
                description: "Desc 1",
                stamps: {
                    total: 5,
                    vouched: 2,
                },
                author: {
                    address: "asdlkvn....asldkvna",
                    handle: "jajablinky"
                }
            },
            {
                id: "asdf2",
                banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
                thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
                title: "Title 1",
                description: "Desc 1",
                stamps: {
                    total: 5,
                    vouched: 2,
                },
                author: {
                    address: "asdlkvn....asldkvna",
                    handle: "jajablinky"
                }
            }
        ];
		return collections.map((collection: any) => {
			return(
                <CollectionCard collection={collection}></CollectionCard>
            );
		});
	}


	return (
        <S.Wrapper>
		    <Carousel title={language.collections} data={getCollections()} />
        </S.Wrapper>
	);
}
