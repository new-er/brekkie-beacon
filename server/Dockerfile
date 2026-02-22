FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /App

COPY . ./
RUN dotnet restore
RUN dotnet publish BrekkieBeacon.Api/BrekkieBeacon.Api.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /App
COPY --from=build /App/out .
ENTRYPOINT ["dotnet", "BrekkieBeacon.Api.dll"]
