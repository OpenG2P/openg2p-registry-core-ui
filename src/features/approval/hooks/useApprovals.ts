import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFetch } from '@/shared/hooks/useFetch';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { ApprovalTask } from '@/features/approval/types/approval';

export const useApprovals = (aweRequestId?: string | null) => {
    const t = useTranslations();
    const [tasks, setTasks] = useState<ApprovalTask[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const fetchOptions = useMemo(
        () => ({
            method: 'POST' as const,
            body: JSON.stringify({
                request_id: aweRequestId,
            }),
        }),
        [aweRequestId],
    );

    const { data: tasksResp, loading: tasksLoading, execute: refetchTasks } = useFetch<{
        tasks: ApprovalTask[];
        total: number;
    }>({
        url: '/api/awe/tasks-for-request',
        enabled: !!aweRequestId,
        options: fetchOptions,
    });

    const { execute: executeDecision } = useFetch<{ decision: unknown }>({
        url: '/api/awe/submit-task-decision',
        enabled: false,
    });

    useEffect(() => {
        setTasks([]);
        if (!aweRequestId) {
            setLoadingTasks(false);
        }
    }, [aweRequestId]);

    useEffect(() => {
        if (!aweRequestId) return;
        if (tasksResp?.tasks) {
            setTasks(tasksResp.tasks);
        }
        setLoadingTasks(tasksLoading);
    }, [tasksResp, tasksLoading, aweRequestId]);

    const submitDecision = useCallback(
        async (taskId: string, action: 'approve' | 'reject', comment: string) => {
            try {
                const result = await executeDecision('/api/awe/submit-task-decision', {
                    method: 'POST',
                    body: JSON.stringify({
                        task_id: taskId,
                        action,
                        comment: comment || null,
                    }),
                });

                if (result?.decision) {
                    toast.success(t('toast_approval_submitted'), {
                        position: 'top-right',
                        autoClose: 4000,
                    });
                    if (aweRequestId) {
                        await refetchTasks('/api/awe/tasks-for-request', fetchOptions);
                    }
                    return true;
                }
                return false;
            } catch {
                toast.error(t('toast_approval_submit_failed'), {
                    autoClose: 5000,
                });
                return false;
            }
        },
        [executeDecision, refetchTasks, aweRequestId, fetchOptions, t],
    );

    return { tasks, loadingTasks, submitDecision };
};
