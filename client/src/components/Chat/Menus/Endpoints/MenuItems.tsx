import type { FC } from 'react';
import { Close } from '@radix-ui/react-popover';
import {
  EModelEndpoint,
  alternateName,
  PermissionTypes,
  Permissions,
} from 'librechat-data-provider';
import { useGetEndpointsQuery } from '~/data-provider';
import MenuSeparator from '../UI/MenuSeparator';
import { getEndpointField } from '~/utils';
import { useHasAccess } from '~/hooks';
import MenuItem from './MenuItem';

import type { TAgentsMap, TInterfaceConfig } from 'librechat-data-provider';

const EndpointItems: FC<{
  endpoints: Array<EModelEndpoint | undefined>;
  selected: EModelEndpoint | '';
  selectedAgentId?: string;
  agentsMap?: TAgentsMap;
  interfaceConfig?: Partial<TInterfaceConfig>;
}> = ({ endpoints = [], selected, selectedAgentId, agentsMap, interfaceConfig }) => {
  const hasAccessToAgents = useHasAccess({
    permissionType: PermissionTypes.AGENTS,
    permission: Permissions.USE,
  });
  const { data: endpointsConfig } = useGetEndpointsQuery();
  return (
    <>
      {endpoints.map((endpoint, i) => {
        if (!endpoint) {
          return null;
        } else if (!endpointsConfig?.[endpoint]) {
          return null;
        }

        if (endpoint === EModelEndpoint.agents && !hasAccessToAgents) {
          return null;
        }

        const userProvidesKey: boolean | null | undefined =
          getEndpointField(endpointsConfig, endpoint, 'userProvide') ?? false;

        if (
          endpoint === EModelEndpoint.agents &&
          interfaceConfig?.agentsStandalone === true &&
          agentsMap
        ) {
          const agents = Object.values(agentsMap);
          return agents.map((agent, j) => (
            <Close asChild key={`endpoint-${agent.id}`}>
              <div key={`endpoint-${agent.id}`}>
                <MenuItem
                  key={`endpoint-item-${agent.id}`}
                  title={agent.name}
                  value={endpoint}
                  agentId={agent.id}
                  selected={
                    selected === endpoint && selectedAgentId === agent.id
                  }
                  data-testid={`endpoint-item-${agent.id}`}
                  userProvidesKey={!!userProvidesKey}
                />
                {i !== endpoints.length - 1 || j !== agents.length - 1 ? (
                  <MenuSeparator />
                ) : null}
              </div>
            </Close>
          ));
        }

        return (
          <Close asChild key={`endpoint-${endpoint}`}>
            <div key={`endpoint-${endpoint}`}>
              <MenuItem
                key={`endpoint-item-${endpoint}`}
                title={alternateName[endpoint] || endpoint}
                value={endpoint}
                selected={selected === endpoint}
                data-testid={`endpoint-item-${endpoint}`}
                userProvidesKey={!!userProvidesKey}
              />
              {i !== endpoints.length - 1 && <MenuSeparator />}
            </div>
          </Close>
        );
      })}
    </>
  );
};

export default EndpointItems;
