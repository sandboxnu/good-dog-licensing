"use client";

import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@good-dog/ui/dialog";

export default function TOSModal({
  isOpen = true,
  close,
  accept,
}: {
  isOpen?: boolean;
  close: () => void;
  accept: () => void;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <DialogContent className="max-h-[700px] overflow-y-scroll border-black sm:max-w-[912px]">
        <DialogHeader>
          <DialogTitle>View & Accept TOS</DialogTitle>
          <DialogDescription className="font-afacad text-s text-good-dog-violet p-7 text-center font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl
            sem, dapibus non tortor auctor, maximus auctor mauris. Donec id odio
            suscipit, pharetra felis a, cursus elit. Donec in lacus felis.
            Praesent egestas venenatis bibendum. Aenean mollis nibh in tortor
            rhoncus mollis. Etiam pellentesque felis eget arcu tempus suscipit.
            Duis condimentum, ipsum vitae fermentum pharetra, risus tortor
            interdum erat, ac mollis sem tellus at risus. Mauris euismod auctor
            tellus. Nunc dapibus, nisl eu vestibulum scelerisque, elit nulla
            hendrerit risus, id euismod metus dolor ut diam. Fusce pulvinar
            aliquet nunc congue auctor. In hac habitasse platea dictumst. Aenean
            tempus ipsum at metus auctor pulvinar. Nullam volutpat posuere
            felis, nec volutpat turpis dapibus vitae. Fusce facilisis sit amet
            eros quis condimentum. Suspendisse sit amet ultrices sapien. Nullam
            tellus diam, pellentesque sed imperdiet sed, faucibus quis elit.
            Aenean id nunc non est tempus facilisis. Proin rhoncus nibh nulla,
            eu tempor urna dictum eget. Fusce interdum lorem in lorem pretium,
            et sollicitudin felis facilisis. Sed imperdiet ex nec ante pharetra,
            eu pulvinar augue feugiat. Quisque nulla arcu, rutrum a elementum
            fermentum, ullamcorper nec felis. Suspendisse potenti. Etiam congue
            sagittis sapien ac mollis. Aliquam nunc ipsum, bibendum sit amet
            suscipit id, porta et magna. Praesent tristique at diam eget
            pretium. Mauris est odio, elementum ut turpis nec, rhoncus varius
            ipsum. Sed non laoreet ante, sed sagittis turpis. Nam id diam
            accumsan, porttitor augue ut, placerat metus. Aenean posuere rhoncus
            nunc in commodo. Duis iaculis rutrum turpis. Vivamus fringilla
            efficitur arcu ac hendrerit. Phasellus dapibus lobortis nisl quis
            dapibus. Aliquam varius, augue nec auctor pharetra, augue nisl
            tristique nulla, at ultricies ligula augue a erat. Nunc egestas mi
            in enim blandit bibendum. Nulla et sem ligula. Morbi pulvinar augue
            nisi, ac finibus est sagittis in. Cras euismod dui egestas nisi
            tristique, nec bibendum nibh feugiat. Morbi viverra elit in sem
            pharetra cursus. Duis a est dapibus, dignissim ligula quis,
            facilisis nisi. Phasellus in fringilla ipsum, ac lobortis dolor. Ut
            at bibendum erat, sit amet pellentesque ex. Cras eget felis quam.
            Sed nec faucibus ante, sed aliquet nisi. Donec eleifend aliquam
            dapibus. Suspendisse imperdiet tincidunt ante, quis lacinia ex
            tempor sed. Fusce efficitur nisi id tortor porttitor luctus. Donec
            dictum, ipsum vel hendrerit tempus, turpis neque ullamcorper augue,
            sit amet tincidunt dolor nibh vitae purus. Ut egestas sollicitudin
            posuere. Curabitur non ex augue. Vivamus non sapien sed orci
            sollicitudin pulvinar ut non eros. Donec finibus, arcu vel imperdiet
            maximus, lacus ex interdum sapien, sit amet egestas neque massa vel
            ex. Nulla facilisi. Nulla posuere nisi quis finibus faucibus. In
            lorem lacus, congue vitae blandit nec, condimentum ut arcu.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Quisque consequat maximus orci, eget
            sodales turpis aliquam sollicitudin. Curabitur lobortis sapien
            dolor, in consectetur lectus tristique id. Sed et luctus dolor.
            Suspendisse fringilla, ligula vitae tempus rhoncus, leo ipsum
            sollicitudin ex, sed varius lorem ipsum vitae dui. Proin tempus
            ligula ex, non malesuada ipsum tempus efficitur. Cras in lectus sit
            amet enim dapibus dictum at eget mauris. Donec viverra neque ac
            tincidunt aliquet. In finibus quam augue, eget ultricies leo euismod
            at. Duis et felis vel dui ullamcorper placerat vel et massa. Proin
            lacinia ante ut eros molestie, ac hendrerit dui tristique. Orci
            varius natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus. Vivamus venenatis velit quis urna mollis, eu
            scelerisque ex placerat. Nunc odio ligula, volutpat et dolor ut,
            ornare convallis purus. In sit amet augue sem. Aenean convallis
            auctor enim consequat feugiat. Nam in arcu id velit dapibus accumsan
            ullamcorper quis massa. Mauris rhoncus turpis non mollis euismod.
            Donec consectetur bibendum risus, eu venenatis risus vulputate
            accumsan. Fusce tempus enim metus, sit amet feugiat dolor suscipit
            nec. Interdum et malesuada fames ac ante ipsum primis in faucibus.
            Etiam suscipit libero non arcu volutpat hendrerit. Nam tempus
            vestibulum ultricies. Nulla at molestie felis. Duis orci lacus,
            interdum a lobortis vel, mattis ut leo. Aliquam erat volutpat. Donec
            elementum, arcu a ultricies dignissim, ipsum enim porttitor nulla,
            ac lacinia ex leo ut tellus. Cras a tempor enim. Proin placerat
            faucibus euismod. Aenean quis justo est. Nam enim mi, tincidunt eu
            tortor nec, volutpat efficitur ex. Quisque sit amet nibh malesuada,
            placerat metus ac, aliquam ipsum. Morbi posuere tellus sed metus
            imperdiet dapibus. Aliquam porttitor id mauris nec tristique. Fusce
            sit amet lacinia massa. Donec ultrices ante sollicitudin nibh
            egestas, vel molestie purus pretium. Proin vel tellus molestie,
            consectetur ipsum a, malesuada nunc. Proin neque diam, euismod quis
            ullamcorper quis, porta a est. Duis aliquet urna at ante elementum,
            non vulputate ipsum posuere. Integer vel gravida quam, sed malesuada
            metus. Pellentesque venenatis, metus at venenatis efficitur, justo
            lorem feugiat turpis, eget porttitor velit eros sit amet massa. Ut
            egestas elit quis turpis faucibus condimentum. Nulla sit amet ante
            in lacus consectetur aliquet vel at urna.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={accept}>
          <DialogFooter>
            <Button type="submit">Accept</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
