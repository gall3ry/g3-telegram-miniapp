import { Button } from "@radix-ui/themes";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { QuestItem } from "./QuestItem";

const Page = () => {
  const items = [
    {
      title: "Bind wallet address",
      description: "Quest description and instruction details goes here.",
      points: 100,
      isClaimable: true,
    },
    {
      title: "Join community",
      description: "Quest description and instruction details goes here.",
      points: 200,
      text: "Join now",
    },
    {
      title: "Unlock GM! template",
      description: "Quest description and instruction details goes here.",
      points: 100,
      text: "Unlock now",
    },
  ];

  return (
    <div>
      <div className="flex justify-center gap-2">
        <Button>Daily quests</Button>
        <Button color="gray" variant="outline">
          Basic quests
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <QuestItem
            key={i}
            title={item.title}
            description={item.description}
            points={item.points}
            text={item.text}
            isClaimable={item.isClaimable}
          />
        ))}
      </div>
    </div>
  );
};

function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
}

export default PageWrapper;
