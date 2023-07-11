import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { Carousel } from 'components/molecules/Carousel';
import * as S from './styles';
import { IProps } from './types';
import { language } from 'helpers/language';
import { IconButton } from 'components/atoms/IconButton';
import { ASSETS } from 'helpers/config';
import { Button } from 'components/atoms/Button';
import { StampWidget } from 'global/StampWidget';

export default function CollectionsCarousel(props: IProps) {
	
    function getCollections() {
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
                <S.CollectionCard key={collection.id}>
                    <S.CollectionCardImage backgroundImage={collection.banner}/>
                    <S.CollectionCardDetails>
                        <S.CollectionCardLabel>
                            <S.CollectionCardLabelThumb backgroundImage={collection.thumbnail}/>
                            <S.CollectionCardLabelInfo>
                                <S.CollectionCardLabelInfoCollection>
                                    {collection.title}
                                </S.CollectionCardLabelInfoCollection>
                                <S.CollectionCardLabelInfoAuthor>
                                    by {collection.author.handle} ({collection.author.address})
                                </S.CollectionCardLabelInfoAuthor>
                            </S.CollectionCardLabelInfo>
                        </S.CollectionCardLabel>
                        <S.CollectionCardStamps>
                            <StampWidget assetId={collection.id} title={collection.title} stamps={collection.stamps}></StampWidget>
                        </S.CollectionCardStamps>
                    </S.CollectionCardDetails>
                    <S.ButtonWrapper>
                        <Button
                            type={'alt3'}
                            label={language.viewCollection}
                            handlePress={() => {}}
                            height={37}
                            fullWidth
                            disabled={false}
                            loading={false}
                            icon={ASSETS.details}
                        />
                    </S.ButtonWrapper>
                </S.CollectionCard>
            );
		});
	}


	return (
        <S.Wrapper>
		    <Carousel title={language.collections} data={getCollections()} />
        </S.Wrapper>
	);
}
