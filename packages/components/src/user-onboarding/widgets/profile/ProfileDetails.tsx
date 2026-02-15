import { MusicAffiliation } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { zProfileValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type z from "zod";
import { getMusicAffiliationLabel } from "../../../../utils/enumLabelMapper";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import RHFDropdown from "../../../rhf-base/RHFDropdown";
import InfoField from "./InfoField";
import ProfileSection from "./ProfileSection";

type ProfileValuesFields = z.input<typeof zProfileValues>;

export default function ProfileDetails() {
  const utils = trpc.useUtils();
  const { data: user } = trpc.user.useQuery();

  const profileFormMethods = useForm<ProfileValuesFields>({
    resolver: zodResolver(zProfileValues),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      ipi: user?.ipi ?? "",
      affiliation: user?.affiliation ?? MusicAffiliation.NONE,
    },
  });

  const affiliation = useWatch({
    control: profileFormMethods.control,
    name: "affiliation",
  });
  const showIpiField = affiliation && affiliation !== MusicAffiliation.NONE;

  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);

  const changeProfileValuesMutation = trpc.changeProfileValues.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      setEditingPersonalDetails(false);
    },
  });

  const handleChangeProfileValues = profileFormMethods.handleSubmit((data) => {
    changeProfileValuesMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      affiliation: data.affiliation,
      ipi: data.ipi,
    });
  });

  const affiliations = Object.values(MusicAffiliation).map((affiliation) => ({
    label:
      getMusicAffiliationLabel(affiliation) === "Neither"
        ? "NONE"
        : getMusicAffiliationLabel(affiliation),
    value: affiliation,
  }));

  return (
    <FormProvider {...profileFormMethods}>
      <ProfileSection
        header="Personal Details"
        editable
        editing={editingPersonalDetails}
        onSave={handleChangeProfileValues}
        onCancel={() => setEditingPersonalDetails(false)}
        onEdit={() => setEditingPersonalDetails(true)}
      >
        <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
          {editingPersonalDetails ? (
            <>
              <div className="flex flex-row gap-16">
                <div className="flex-1">
                  <RHFTextInput<ProfileValuesFields>
                    rhfName={"firstName"}
                    label={"First name"}
                    placeholder={""}
                    id={"firstName"}
                    errorText={
                      profileFormMethods.formState.errors.firstName?.message
                    }
                    clearIcon
                  />
                </div>
                <div className="flex-1">
                  <RHFTextInput<ProfileValuesFields>
                    rhfName={"lastName"}
                    label={"Last Name"}
                    placeholder={""}
                    id={"lastName"}
                    errorText={
                      profileFormMethods.formState.errors.lastName?.message
                    }
                    clearIcon
                  />
                </div>
              </div>
              <div className="flex flex-row gap-16">
                <div className="flex-1">
                  <RHFDropdown<ProfileValuesFields>
                    rhfName={"affiliation"}
                    label={"Group"}
                    placeholder={""}
                    options={affiliations}
                    arrow={true}
                    id={"affiliation"}
                    errorText={
                      profileFormMethods.formState.errors.affiliation?.message
                    }
                  />
                </div>
                <div className="flex-1">
                  {showIpiField && (
                    <RHFTextInput<ProfileValuesFields>
                      rhfName={"ipi"}
                      label={"IPI No."}
                      placeholder={""}
                      id={"ipi"}
                      errorText={
                        profileFormMethods.formState.errors.ipi?.message
                      }
                      clearIcon
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row gap-16">
                <div className="flex-1">
                  <InfoField
                    header="First name"
                    content={user?.firstName ?? ""}
                  />
                </div>
                <div className="flex-1">
                  <InfoField
                    header="Last name"
                    content={user?.lastName ?? ""}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-16">
                <div className="flex-1">
                  <InfoField
                    header="Group"
                    content={user?.affiliation ?? "NONE"}
                  />
                </div>
                <div className="flex-1">
                  {showIpiField && (
                    <InfoField header="IPI No." content={user?.ipi ?? "NONE"} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </ProfileSection>
    </FormProvider>
  );
}
