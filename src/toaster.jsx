import { Toaster, Portal, Spinner, Stack, Toast, createToaster,} from "@chakra-ui/react";

export const toaster = createToaster({
    placement: "bottom-end",
    pauseOnPageIdle: true,
});

export const AppToaster = () => {
    return (
        <Portal>
            <Toaster toaster={toaster}>
                {(toast) => (
                    <Toast.Root
                   width={{ base: "280px", md: "sm" }}
                  maxWidth="90vw"
                  >

                    {toast.type === "loading" ? (

                        <Spinner
                        size="sm" /> ) : ( <Toast.Indicator/>
                    )}

                       <Stack 
                       gap= "1"
                       flex= "1"
                       maxWidth= "100%">

                       {toast.title && <Toast.Title>{toast.title}</Toast.Title>}

                       {toast.description && (

                        <Toast.Description>{toast.description}</Toast.Description>
                       )}
                       </Stack>

                       {toast.action && (
                        <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
                       )}

                       {toast.meta?.closable && <Toast.CloseTrigger />}
                       </Toast.Root>
                    )}
                    </Toaster>
                    </Portal>

                );

        };