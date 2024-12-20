import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader
  } from "@/components/ui/dialog";
  import { Button } from '@/components/ui/button';


  export function DeleteDialog({ isDialogOpen, setDialogOpen, onClose }){
    
    return(
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[370px] bg-white">
              <DialogHeader>
                <DialogDescription>
                  Are you sure you want to delete the Task?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="w-full focus:outline-none focus:ring-0 focus:border-black-500"
                  onClick={() => {
                    setDialogOpen(false); 
                    onClose(); 
                  }}                
                  >
                  Cancel
                </Button>
                <Button 
                  className="ml-2 w-full"
                  onClick={() => {
                    setDialogOpen(false);
                    onClose(); 
                  }}                
                  >
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    );

  }