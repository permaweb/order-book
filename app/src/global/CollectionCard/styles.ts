import styled from 'styled-components';


export const CollectionCard = styled.div<{height: number}>`
    height: ${props => props.height}px;
    width: 100%;
    border-radius: 6px;
    overflow:hidden;
    border-left: 1px solid #E0E0E0;
    border-right: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
`;

export const CollectionCardImage = styled.div<{backgroundImage: string, buttonHidden: boolean}>`
    width: 100%;
    height: ${props => props.buttonHidden ? '78%' : '72%'};
    background-image: url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: rgb(0, 0, 0);
`;

export const CollectionCardDetails = styled.div<{buttonHidden: boolean}>`
    width: 100%;
    height: ${props => props.buttonHidden ? '22%' : '16%'};
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