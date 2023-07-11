import styled from 'styled-components';

export const Wrapper = styled.div`
    height: 550px;
	h2 {
		margin: 0 0 40px 0;
	}
`;


export const CollectionCard = styled.div`
    width: 100%;
    height: 100%;
`;

export const CollectionCardImage = styled.div<{backgroundImage: string}>`
    width: 100%;
    height: 72%;
    background-image: url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
`;

export const CollectionCardDetails = styled.div`
    width: 100%;
    height: 16%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 14px;
    padding-right: 14px;
`;

export const CollectionCardLabel = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const CollectionCardLabelThumb = styled.div<{backgroundImage: string}>`
    height: 50px;
    width: 50px;
    background-image: url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
    margin-right: 15px;
`;

export const CollectionCardLabelInfo = styled.div`
    text-align: left;
    padding-top: 4px;
    color: black;
`;

export const CollectionCardLabelInfoCollection = styled.div`
    font-size: 18px;
    margin-bottom: 4px;
`;

export const CollectionCardLabelInfoAuthor = styled.div`
    font-size: 12px;
`;

export const CollectionCardStamps = styled.div`

`;

export const ButtonWrapper = styled.div`
    padding-left: 14px;
    padding-right: 14px;
    width: 100%;
`;