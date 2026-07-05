import type { Meta, StoryObj } from "@storybook/react";
import { CommandRow, ScenarioCard, commands, scenarios } from "./App.tsx";

const meta = {
  title: "Visual Hive Test Lab/Fixtures",
  parameters: {
    layout: "padded"
  }
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const ScenarioMutationCard: Story = {
  render: () => <ScenarioCard scenario={scenarios[3]} active />
};

export const CommandMatrixRow: Story = {
  render: () => <CommandRow command={commands[2]} />
};
