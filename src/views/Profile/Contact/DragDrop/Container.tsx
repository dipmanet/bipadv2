/* eslint-disable no-lone-blocks */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable import/prefer-default-export */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-indent-props */
import update from "immutability-helper";
import { useCallback, useState } from "react";
import { Card } from "./Card";

const style = {
  width: 400,
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};
export const Container = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: "Write 1",
      },
      {
        id: 2,
        text: "Write 2",
      },
      {
        id: 3,
        text: "Write 3",
      },
      {
        id: 4,
        text: "Write 4",
      },
      {
        id: 5,
        text: "Write 5",
      },
      {
        id: 6,
        text: "Write 6",
      },
      {
        id: 7,
        text: "Write 7",
      },
      {
        id: 8,
        text: "Write 8",
      },
      {
        id: 9,
        text: "Write 9",
      },
      {
        id: 10,
        text: "Write 10",
      },
      {
        id: 11,
        text: "Write 11",
      },
    ]);
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);

    const renderCard = useCallback(
      (card, index) => (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      ),
      [moveCard]
    );
    return (
      <>
        <div style={style} className="test">
          {cards.map((card, i) => renderCard(card, i))}
        </div>
      </>
    );
  }
};
