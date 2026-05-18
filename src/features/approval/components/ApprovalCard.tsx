'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ApprovalTask } from '@/features/approval/types/approval';
import { formatDateTime } from '@/shared/utils/dateUtils';
import { useAuth } from '@/context/Authcontext';
import { useRbac } from '@/context/RbacContext';
import { VERIFICATION_CHANGE_REQUEST_ACTIONS } from '@/features/change-request/utils/verificationChangeRequest.actions';
import { VERIFICATION_INTAKE_FORM_ACTIONS } from '@/features/intake-form/utils/verificationIntakeForm.actions';

interface Props {
    task: ApprovalTask;
    isPending: boolean;
    onSubmit: (taskId: string, action: 'approve' | 'reject', comment: string) => Promise<boolean>;
    intakeForm?: boolean;
}

export default function ApprovalCard({ task, isPending, onSubmit, intakeForm = false }: Props) {
    const t = useTranslations();
    const { user } = useAuth();
    const { can } = useRbac();
    const canAct = can(
        intakeForm
            ? VERIFICATION_INTAKE_FORM_ACTIONS.create
            : VERIFICATION_CHANGE_REQUEST_ACTIONS.create,
    );
    const [comment, setComment] = useState('');
    const [isApproved, setIsApproved] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const isCurrentUser = Boolean(user?.sub && task.assignee === user.sub);
    const assigneeDisplay = isCurrentUser ? user.name : task.assignee;

    const isTaskActionable = task.status === 'open' || task.status === 'claimed';
    const isActionable = isPending && canAct && isCurrentUser && isTaskActionable;

    const hasDecision = Boolean(task.decision_action);
    const decisionApproved = task.decision_action === 'approve';
    const displayDate = task.completed_at || task.created_at;

    const handleSubmit = async () => {
        setSubmitting(true);
        const action = isApproved ? 'approve' : 'reject';
        const success = await onSubmit(task.id, action, comment);
        if (success) {
            setComment('');
            setIsApproved(true);
        }
        setSubmitting(false);
    };

    return (
        <div className="bg-secondary-second rounded-[10px] p-6 space-y-3">
            <div className="font-normal text-[14px] text-neutral-first/50">{t('assigned_to')}</div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative">
                    <Image
                        src="/images/common/verified_person.png"
                        alt="approver"
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-[20px] font-medium text-neutral-first">
                        {assigneeDisplay}
                        {isCurrentUser && (
                            <span className="ml-2 text-[14px] text-neutral-first/50">{t('you')}</span>
                        )}
                    </span>
                    <span className="text-[14px] text-neutral-first/50 font-normal">
                        {formatDateTime(displayDate)}
                    </span>
                </div>
            </div>

            <div className="flex justify-between pr-10">
                <div>
                    <div className="text-[14px] font-normal text-neutral-first/50 mb-1">{t('stage')}</div>
                    <div className="text-[16px] text-neutral-first font-normal">
                        {task.stage_order}
                    </div>
                </div>

                <div>
                    <div className="text-[14px] font-normal text-neutral-first/50 mb-1">{t('status')}</div>
                    <div className="text-[16px] text-neutral-first font-normal capitalize">{task.status}</div>
                </div>
            </div>

            {isActionable ? (
                <>
                    <div>
                        <div className="text-[14px] font-medium text-neutral-first/50 mb-1">{t('message')}</div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                            placeholder={t('type_your_message')}
                            className="w-full border border-black/25 rounded-[10px] p-2 text-sm resize-none focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-6">
                            <StatusOption
                                label={t('ok')}
                                isActive={isApproved}
                                onClick={() => setIsApproved(true)}
                            />
                            <StatusOption
                                label={t('not_ok')}
                                isActive={!isApproved}
                                onClick={() => setIsApproved(false)}
                            />
                        </div>

                        <button
                            type="button"
                            disabled={submitting}
                            onClick={handleSubmit}
                            className="px-4 py-1.5 text-sm rounded-xl bg-neutral-first text-neutral-second disabled:opacity-50"
                        >
                            {t('submit')}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {(task.decision_comment || hasDecision) && (
                        <div>
                            <div className="text-[14px] font-normal text-neutral-first/50 mb-1">
                                {t('message')}
                            </div>
                            <div className="text-[16px] text-neutral-first font-normal whitespace-pre-wrap">
                                {task.decision_comment?.trim() || '—'}
                            </div>
                        </div>
                    )}

                    {hasDecision && (
                        <div className="flex items-center gap-6 pt-2">
                            <StatusIndicator label={t('ok')} isActive={decisionApproved} />
                            <StatusIndicator label={t('not_ok')} isActive={!decisionApproved} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const StatusOption = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button type="button" className="flex items-center gap-2 text-neutral-first" onClick={onClick}>
        <div
            className={`w-6 h-6 border rounded flex items-center justify-center ${
                isActive ? 'border-primary-second bg-neutral-second' : 'border-secondary-third bg-neutral-second'
            }`}
        >
            {isActive && <Image src="/images/common/tick.png" alt="tick" width={16} height={16} />}
        </div>
        <span className="text-[14px] font-medium">{label}</span>
    </button>
);

const StatusIndicator = ({ label, isActive }: { label: string; isActive: boolean }) => (
    <div className="flex items-center gap-2 text-neutral-first">
        <div
            className={`w-6 h-6 border rounded flex items-center justify-center ${
                isActive ? 'border-primary-second bg-neutral-second' : 'border-secondary-third bg-neutral-second'
            }`}
        >
            {isActive && <Image src="/images/common/tick.png" alt="tick" width={16} height={16} />}
        </div>
        <span className="text-[14px] font-medium">{label}</span>
    </div>
);
