/*
  Warnings:

  - Made the column `image` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ALTER COLUMN [image] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_image_df] DEFAULT 'https://www.gravatar.com/avatar/a6ea2c1cffdd6f99c2ea02a97f48bea3?s=200&r=pg&d=mm' FOR [image];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
