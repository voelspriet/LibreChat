import { memo, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  supportsFiles,
  mergeFileConfig,
  isAgentsEndpoint,
  EndpointFileConfig,
  fileConfig as defaultFileConfig,
} from 'librechat-data-provider';
import { useGetFileConfig } from '~/data-provider';
import { SystemRoles } from 'librechat-data-provider';
import { useAuthContext } from '~/hooks';
import AttachFileMenu from './AttachFileMenu';
import { useChatContext } from '~/Providers';
import { useFileHandling } from '~/hooks';
import AttachFile from './AttachFile';
import FileRow from './FileRow';
import store from '~/store';

function FileFormWrapper({
  children,
  disableInputs,
}: {
  disableInputs: boolean;
  children?: React.ReactNode;
}) {
  const chatDirection = useRecoilValue(store.chatDirection).toLowerCase();
  const { files, setFiles, conversation, setFilesLoading } = useChatContext();
  const { endpoint: _endpoint, endpointType } = conversation ?? { endpoint: null };
  const isAgents = useMemo(() => isAgentsEndpoint(_endpoint), [_endpoint]);
  const { user } = useAuthContext();

  const { handleFileChange, abortUpload } = useFileHandling();

  const { data: fileConfig = defaultFileConfig } = useGetFileConfig({
    select: (data) => mergeFileConfig(data),
  });

  const isRTL = chatDirection === 'rtl';

  const endpointFileConfig = fileConfig.endpoints[_endpoint ?? ''] as
    | EndpointFileConfig
    | undefined;

  const endpointSupportsFiles: boolean = supportsFiles[endpointType ?? _endpoint ?? ''] ?? false;
  const isUploadDisabled = (disableInputs || endpointFileConfig?.disabled) ?? false;

  const renderAttachFile = () => {
    if (user?.role !== SystemRoles.ADMIN) {
      return null;
    }
    if (isAgents) {
      return (
        <AttachFileMenu
          isRTL={isRTL}
          disabled={disableInputs}
          handleFileChange={handleFileChange}
        />
      );
    }
    if (endpointSupportsFiles && !isUploadDisabled) {
      return (
        <AttachFile isRTL={isRTL} disabled={disableInputs} handleFileChange={handleFileChange} />
      );
    }

    return null;
  };

  return (
    <>
      <FileRow
        files={files}
        setFiles={setFiles}
        abortUpload={abortUpload}
        setFilesLoading={setFilesLoading}
        isRTL={isRTL}
        Wrapper={({ children }) => <div className="mx-2 mt-2 flex flex-wrap gap-2">{children}</div>}
      />
      {children}
      {renderAttachFile()}
    </>
  );
}

export default memo(FileFormWrapper);
