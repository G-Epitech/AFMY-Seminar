import { Employee } from "@seminar/common";

type UnknownUser = Employee | null | undefined;

export function authLoading(user: UnknownUser)
{
    return user === undefined;
}

export function authError(user: UnknownUser)
{
    return user === null;
}

export function authSuccess(user: UnknownUser)
{
    return user !== undefined && user !== null;
}
