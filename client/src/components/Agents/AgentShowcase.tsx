import { useSelectAgent } from '~/hooks';
import { useListAgentsQuery } from '~/data-provider';
import { useLocalize } from '~/hooks';

export default function AgentShowcase() {
  const { onSelect } = useSelectAgent();
  const { data } = useListAgentsQuery();
  const localize = useLocalize();
  const agents = data?.data ?? [];

  if (!agents.length) {
    return <div className="text-center text-sm text-text-secondary">{localize('com_agents_showcase_none')}</div>;
  }

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelect(agent.id)}
          className="flex w-36 flex-col items-center gap-2 rounded-xl border border-border-medium p-3 hover:bg-surface-tertiary"
        >
          {agent.avatar?.filepath && (
            <img src={agent.avatar.filepath} alt={agent.name} className="h-12 w-12 rounded-full object-cover" />
          )}
          <span className="text-sm font-medium text-text-primary">{agent.name}</span>
        </button>
      ))}
    </div>
  );
}
